@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo De installatie is nog niet gebeurd.
  echo Dubbelklik eerst  setup.bat.
  echo.
  pause
  exit /b 1
)

echo Transcriptie-bewaker gestart. Laat dit venster open staan.
echo Stoppen kan met  Ctrl+C  of door dit venster te sluiten.
echo.
".venv\Scripts\python.exe" transcribeer.py
pause
