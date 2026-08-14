@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo    GPU inschakelen (NVIDIA)  --  CUDA-bibliotheken installeren
echo ============================================================
echo.

if not exist ".venv\Scripts\python.exe" (
  echo [FOUT] De installatie is nog niet gebeurd.
  echo Dubbelklik eerst  setup.bat.
  pause
  exit /b 1
)

echo Dit downloadt de CUDA-bibliotheken (cuBLAS + cuDNN, enkele honderden MB).
echo Even geduld...
echo.
".venv\Scripts\python.exe" -m pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
if errorlevel 1 (
  echo.
  echo [FOUT] Installeren mislukt. Controleer je internetverbinding.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo    KLAAR. De GPU wordt nu automatisch gebruikt.
echo    Start de bewaker opnieuw met  start.bat.
echo    (In het venster zie je dan  device=cuda  staan.)
echo ============================================================
echo.
pause
