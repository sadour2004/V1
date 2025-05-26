@echo off
echo Starting Machine Status Server...
start /B backend.exe
echo Server is running on http://localhost:5000
echo Press Ctrl+C to stop the server
pause 