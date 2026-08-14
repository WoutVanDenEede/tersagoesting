@echo off
REM Start de transcriptie-bewaker. Pas het pad hieronder aan indien nodig.
cd /d "%~dp0"
call ".venv\Scripts\activate.bat"
python transcribeer.py
