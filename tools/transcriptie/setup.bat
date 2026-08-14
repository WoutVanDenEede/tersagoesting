@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo    Transcriptie-bewaker  --  eenmalige installatie
echo ============================================================
echo.

REM --- 1. Is Python geinstalleerd? ---
python --version >nul 2>&1
if errorlevel 1 (
  echo [FOUT] Python is niet gevonden op deze pc.
  echo.
  echo   1. Ga naar https://www.python.org/downloads/
  echo   2. Installeer Python en vink "Add python.exe to PATH" aan.
  echo   3. Start dit bestand ^(setup.bat^) daarna opnieuw.
  echo.
  pause
  exit /b 1
)
echo [ok] Python gevonden.

REM --- 2. Aparte Python-omgeving aanmaken ---
echo [1/3] Aparte Python-omgeving aanmaken...
python -m venv .venv
if errorlevel 1 (
  echo [FOUT] Kon de omgeving niet aanmaken.
  pause
  exit /b 1
)

REM --- 3. Pakketten installeren ---
echo [2/3] Pakketten installeren ^(dit kan enkele minuten duren^)...
".venv\Scripts\python.exe" -m pip install --upgrade pip
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
  echo [FOUT] Installeren van de pakketten is mislukt.
  echo Controleer je internetverbinding en probeer opnieuw.
  pause
  exit /b 1
)

REM --- 4. config.ini aanmaken als die nog niet bestaat ---
echo [3/3] Instellingen klaarzetten...
if not exist "config.ini" (
  copy "config.example.ini" "config.ini" >nul
  echo   config.ini aangemaakt ^(op basis van het voorbeeld^).
) else (
  echo   config.ini bestaat al - ongewijzigd gelaten.
)

echo.
echo ============================================================
echo    KLAAR. De installatie is gelukt.
echo.
echo    Volgende stap: dubbelklik  start.bat  om te testen,
echo    of lees verder in INSTALLATIE.md.
echo ============================================================
echo.
pause
