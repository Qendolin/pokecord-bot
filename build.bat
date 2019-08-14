@echo off
rd /S /Q "build"
mkdir "build/js"
copy ".\src\manifest.json" ".\build\"
copy ".\src\toolbar.js" ".\build\js\"

echo Running Browserify
start /WAIT cmd /C npx browserify ./src/model/messaging/sender.messaging.js -o ./build/js/bot.js

rd /S /Q "dist"
mkdir "dist"
echo Packing Extension
del ".\dist\PokecordBot.xpi"
Powershell Compress-Archive -Path ./build/* -DestinationPath ./dist/PokecordBot.zip
ren ".\dist\PokecordBot.zip" "PokecordBot.xpi"

echo Done