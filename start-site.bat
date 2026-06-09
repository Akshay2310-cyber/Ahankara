@echo off
REM ===== AHANKARAKA — local preview launcher =====
title AHANKARAKA local server
cd /d "%~dp0"
set PY="C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe"
if not exist %PY% set PY=python
echo Starting AHANKARAKA at http://localhost:8123 ...
start "" "http://localhost:8123/index.html"
%PY% -m http.server 8123
