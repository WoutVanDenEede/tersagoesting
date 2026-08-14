#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audio-transcriptie-bewaker voor Tersagoesting.

Bewaakt een OneDrive-map, transcribeert nieuwe audio-interviews lokaal met
Whisper (faster-whisper) en levert een opgekuiste .txt-transcriptie terug in
dezelfde map.

Draait als achtergrondproces op de Windows-pc. Zie INSTALLATIE.md.

Ontworpen op betrouwbaarheid: stabiliteitscheck, OneDrive-placeholder-detectie,
verwerkt-logboek, per-bestand foutafscherming en atomair wegschrijven.
"""

import configparser
import hashlib
import json
import logging
import os
import stat
import sys
import time
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuratie inlezen
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = SCRIPT_DIR / "config.ini"

if not CONFIG_PATH.exists():
    print(
        f"Geen config.ini gevonden op {CONFIG_PATH}.\n"
        "Kopieer config.example.ini naar config.ini en pas ze aan.",
        file=sys.stderr,
    )
    sys.exit(1)

_cfg = configparser.ConfigParser()
_cfg.read(CONFIG_PATH, encoding="utf-8")

WATCH_DIR = Path(_cfg.get("algemeen", "watch_dir")).expanduser()
POLL_SECONDS = _cfg.getint("algemeen", "poll_seconds", fallback=10)
STABLE_SECONDS = _cfg.getint("algemeen", "stable_seconds", fallback=30)
SCHRIJF_RUW = _cfg.getboolean("algemeen", "schrijf_ruwe_transcriptie", fallback=False)

WHISPER_MODEL = _cfg.get("whisper", "model", fallback="medium")
WHISPER_DEVICE = _cfg.get("whisper", "device", fallback="auto")
WHISPER_COMPUTE = _cfg.get("whisper", "compute_type", fallback="int8")
WHISPER_TAAL = _cfg.get("whisper", "taal", fallback="nl")

OPKUIS_MODE = _cfg.get("opkuis", "mode", fallback="claude").strip().lower()
CLAUDE_MODEL = _cfg.get("opkuis", "claude_model", fallback="claude-sonnet-5")
CLAUDE_MAX_TOKENS = _cfg.getint("opkuis", "max_tokens", fallback=16000)
OLLAMA_MODEL = _cfg.get("opkuis", "ollama_model", fallback="llama3.1")
OLLAMA_URL = _cfg.get("opkuis", "ollama_url", fallback="http://localhost:11434")

# Audio-extensies die de gsm/OneDrive kan opleveren.
AUDIO_EXT = {
    ".m4a", ".mp3", ".wav", ".aac", ".ogg", ".oga", ".opus",
    ".mp4", ".3gp", ".3gpp", ".amr", ".flac", ".wma", ".mkv",
}

OUTPUT_SUFFIX = "_OPGEKUISD"
RUW_SUFFIX = "_RUW"
LEDGER_PATH = SCRIPT_DIR / ".verwerkt.json"
LOG_PATH = SCRIPT_DIR / "transcribeer.log"
OPKUIS_PROMPT_PATH = SCRIPT_DIR / "opkuis_prompt.md"

# Windows-bestandsattributen voor OneDrive Files-On-Demand.
FILE_ATTRIBUTE_OFFLINE = 0x1000
FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS = 0x400000

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logger = logging.getLogger("transcribeer")
logger.setLevel(logging.INFO)
_fmt = logging.Formatter("%(asctime)s  %(levelname)-7s  %(message)s")
_fh = RotatingFileHandler(LOG_PATH, maxBytes=1_000_000, backupCount=3, encoding="utf-8")
_fh.setFormatter(_fmt)
logger.addHandler(_fh)
_sh = logging.StreamHandler(sys.stdout)
_sh.setFormatter(_fmt)
logger.addHandler(_sh)


# ---------------------------------------------------------------------------
# Verwerkt-logboek (ledger)
# ---------------------------------------------------------------------------
def laad_ledger() -> dict:
    if LEDGER_PATH.exists():
        try:
            return json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Kon logboek niet lezen (%s); start met leeg logboek.", exc)
    return {}


def bewaar_ledger(ledger: dict) -> None:
    tmp = LEDGER_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(ledger, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, LEDGER_PATH)


def bestand_sleutel(pad: Path) -> str:
    """Unieke sleutel op basis van naam + grootte + wijzigingstijd."""
    st = pad.stat()
    ruw = f"{pad.name}|{st.st_size}|{int(st.st_mtime)}"
    return hashlib.sha1(ruw.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Bestandschecks
# ---------------------------------------------------------------------------
def is_output_bestand(pad: Path) -> bool:
    stem = pad.stem
    return stem.endswith(OUTPUT_SUFFIX) or stem.endswith(RUW_SUFFIX)


def is_onedrive_placeholder(pad: Path) -> bool:
    """True als het bestand een OneDrive 'online-only' placeholder is."""
    try:
        attrs = pad.stat().st_file_attributes  # enkel Windows
    except AttributeError:
        return False  # niet-Windows: geen placeholders
    except OSError:
        return False
    return bool(attrs & (FILE_ATTRIBUTE_OFFLINE | FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS))


def forceer_download(pad: Path) -> bool:
    """Probeer een placeholder te hydrateren door 1 byte te lezen."""
    try:
        with open(pad, "rb") as fh:
            fh.read(1)
        return not is_onedrive_placeholder(pad)
    except OSError as exc:
        logger.info("Download van %s nog niet klaar (%s).", pad.name, exc)
        return False


def is_stabiel(pad: Path, snapshots: dict) -> bool:
    """
    True als de bestandsgrootte STABLE_SECONDS lang niet veranderde.
    Houdt per bestand (grootte, tijdstip-eerste-waarneming-op-die-grootte) bij.
    """
    try:
        grootte = pad.stat().st_size
    except OSError:
        return False

    nu = time.monotonic()
    vorige = snapshots.get(pad)
    if vorige is None or vorige[0] != grootte:
        snapshots[pad] = (grootte, nu)
        return False
    return (nu - vorige[1]) >= STABLE_SECONDS


# ---------------------------------------------------------------------------
# Transcriptie (lokaal, faster-whisper)
# ---------------------------------------------------------------------------
_whisper_model = None


def _voeg_cuda_dll_paden_toe() -> None:
    """Op Windows: laat CTranslate2 de cuBLAS/cuDNN-DLL's van de
    nvidia-*-pip-pakketten vinden. Zonder dit valt de GPU-versie stil terug
    op de processor."""
    if os.name != "nt":
        return
    for base in list(sys.path):
        nvidia_dir = os.path.join(base, "nvidia")
        if not os.path.isdir(nvidia_dir):
            continue
        for naam in os.listdir(nvidia_dir):
            bin_dir = os.path.join(nvidia_dir, naam, "bin")
            if os.path.isdir(bin_dir):
                try:
                    os.add_dll_directory(bin_dir)
                except OSError:
                    pass


def _detecteer_device(voorkeur: str, compute: str):
    """Bepaal device + compute_type. 'auto' kiest de GPU als CTranslate2 er een
    kan gebruiken, anders de processor."""
    if voorkeur != "auto":
        return voorkeur, compute
    try:
        import ctranslate2

        heeft_gpu = ctranslate2.get_cuda_device_count() > 0
    except Exception:
        heeft_gpu = False
    if heeft_gpu:
        return "cuda", ("float16" if compute == "int8" else compute)
    return "cpu", compute


def get_whisper():
    global _whisper_model
    if _whisper_model is None:
        _voeg_cuda_dll_paden_toe()
        from faster_whisper import WhisperModel

        device, compute = _detecteer_device(WHISPER_DEVICE, WHISPER_COMPUTE)
        logger.info(
            "Whisper-model laden: %s (device=%s, compute=%s) ...",
            WHISPER_MODEL, device, compute,
        )
        _whisper_model = WhisperModel(WHISPER_MODEL, device=device, compute_type=compute)
        logger.info("Whisper-model geladen.")
    return _whisper_model


def transcribeer(pad: Path) -> str:
    model = get_whisper()
    segments, info = model.transcribe(
        str(pad),
        language=WHISPER_TAAL,
        vad_filter=True,
        beam_size=5,
    )
    delen = [seg.text.strip() for seg in segments]
    tekst = " ".join(d for d in delen if d)
    logger.info(
        "Transcriptie klaar: %s (%.0f s audio).",
        pad.name, getattr(info, "duration", 0.0),
    )
    return tekst.strip()


# ---------------------------------------------------------------------------
# Opkuis
# ---------------------------------------------------------------------------
def lees_opkuis_prompt() -> str:
    if OPKUIS_PROMPT_PATH.exists():
        return OPKUIS_PROMPT_PATH.read_text(encoding="utf-8")
    logger.warning("Geen opkuis_prompt.md gevonden; gebruik minimale standaardinstructie.")
    return (
        "Kuis de volgende ruwe transcriptie op tot een vlot leesbare Nederlandse "
        "tekst. Verwijder stopwoorden en 'euh's, voeg leestekens en alinea's toe, "
        "maar verzin niets bij en blijf trouw aan de inhoud."
    )


def opkuis_claude(ruw: str) -> str:
    import anthropic

    client = anthropic.Anthropic()  # leest ANTHROPIC_API_KEY uit de omgeving
    prompt = lees_opkuis_prompt()
    bericht = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=CLAUDE_MAX_TOKENS,
        system=prompt,
        messages=[{
            "role": "user",
            "content": (
                "Hier is de ruwe transcriptie. Lever enkel de opgekuiste versie "
                "terug, zonder inleiding of commentaar.\n\n" + ruw
            ),
        }],
    )
    stukken = [blk.text for blk in bericht.content if getattr(blk, "type", "") == "text"]
    return "".join(stukken).strip()


def opkuis_ollama(ruw: str) -> str:
    import urllib.request

    prompt = lees_opkuis_prompt()
    payload = json.dumps({
        "model": OLLAMA_MODEL,
        "system": prompt,
        "prompt": (
            "Hier is de ruwe transcriptie. Lever enkel de opgekuiste versie "
            "terug, zonder inleiding of commentaar.\n\n" + ruw
        ),
        "stream": False,
    }).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_URL.rstrip("/") + "/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data.get("response", "").strip()


def opkuis(ruw: str) -> str:
    if OPKUIS_MODE == "none" or not ruw:
        return ruw
    if OPKUIS_MODE == "claude":
        return opkuis_claude(ruw)
    if OPKUIS_MODE == "ollama":
        return opkuis_ollama(ruw)
    logger.warning("Onbekende opkuis-mode '%s'; ruwe transcriptie behouden.", OPKUIS_MODE)
    return ruw


# ---------------------------------------------------------------------------
# Wegschrijven (atomair)
# ---------------------------------------------------------------------------
def schrijf_atomair(pad: Path, inhoud: str) -> None:
    tmp = pad.with_suffix(pad.suffix + ".tmp")
    tmp.write_text(inhoud, encoding="utf-8")
    os.replace(tmp, pad)


def maak_kop(bron: Path, soort: str) -> str:
    nu = datetime.now().strftime("%Y-%m-%d %H:%M")
    return (
        f"# {soort} — {bron.name}\n"
        f"# Gegenereerd op {nu} met Whisper ({WHISPER_MODEL}).\n"
        f"{'=' * 60}\n\n"
    )


# ---------------------------------------------------------------------------
# Eén bestand verwerken
# ---------------------------------------------------------------------------
def verwerk(pad: Path) -> None:
    logger.info("Start verwerking: %s", pad.name)
    ruw = transcribeer(pad)
    if not ruw:
        logger.warning("Lege transcriptie voor %s; overslaan.", pad.name)
        return

    if SCHRIJF_RUW:
        ruw_pad = pad.with_name(pad.stem + RUW_SUFFIX + ".txt")
        schrijf_atomair(ruw_pad, maak_kop(pad, "RUWE TRANSCRIPTIE") + ruw + "\n")
        logger.info("Ruwe transcriptie geschreven: %s", ruw_pad.name)

    try:
        proper = opkuis(ruw)
    except Exception as exc:  # opkuis mag de ruwe output nooit verhinderen
        logger.error("Opkuis mislukt voor %s (%s); ruwe tekst wordt afgeleverd.", pad.name, exc)
        proper = ruw

    uit_pad = pad.with_name(pad.stem + OUTPUT_SUFFIX + ".txt")
    schrijf_atomair(uit_pad, maak_kop(pad, "OPGEKUISDE TRANSCRIPTIE") + proper + "\n")
    logger.info("Opgekuisde transcriptie afgeleverd: %s", uit_pad.name)


# ---------------------------------------------------------------------------
# Hoofdlus
# ---------------------------------------------------------------------------
def scan_ronde(ledger: dict, snapshots: dict) -> None:
    if not WATCH_DIR.exists():
        logger.warning("Map bestaat (nog) niet: %s", WATCH_DIR)
        return

    for pad in sorted(WATCH_DIR.iterdir()):
        if not pad.is_file():
            continue
        if pad.suffix.lower() not in AUDIO_EXT:
            continue
        if is_output_bestand(pad):
            continue

        if is_onedrive_placeholder(pad):
            if not forceer_download(pad):
                logger.info("Nog niet lokaal beschikbaar (OneDrive): %s", pad.name)
                continue

        try:
            sleutel = bestand_sleutel(pad)
        except OSError:
            continue
        if sleutel in ledger:
            continue

        if not is_stabiel(pad, snapshots):
            continue  # nog aan het uploaden/wijzigen

        try:
            verwerk(pad)
            ledger[sleutel] = {
                "naam": pad.name,
                "verwerkt_op": datetime.now().isoformat(timespec="seconds"),
            }
            bewaar_ledger(ledger)
            snapshots.pop(pad, None)
        except Exception:
            logger.exception("Fout bij verwerken van %s; ga door met de rest.", pad.name)


def main() -> None:
    logger.info("=" * 60)
    logger.info("Transcriptie-bewaker gestart. Map: %s", WATCH_DIR)
    logger.info("Whisper-model: %s | Opkuis: %s", WHISPER_MODEL, OPKUIS_MODE)
    ledger = laad_ledger()
    snapshots: dict = {}
    while True:
        try:
            scan_ronde(ledger, snapshots)
        except Exception:
            logger.exception("Onverwachte fout in scanronde; ga door.")
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Gestopt door gebruiker.")
