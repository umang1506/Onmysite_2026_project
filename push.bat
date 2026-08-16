@echo off
set MSG=%~1
if "%MSG%"=="" set MSG=update code

git add .
git commit -m "%MSG%"
git push origin main
