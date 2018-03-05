@echo off
if "%PHPBIN%" == "" set PHPBIN=D:\Server\XAMPP\php\php.exe
"%PHPBIN%" "composer.phar" %*
