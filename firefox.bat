@ECHO OFF

CALL build.bat
"%PYTHON2%" "%CFX%" run --pkgdir=bin/tmp/firefox -p "%FFPROFILE%"
