@echo off
rd /S /Q "build"
mkdir "build/js"
copy ".\src\manifest.json" ".\build\"

echo Running Browserify
cmd /C npx browserify -x ./static/cache.js ./src/main.js -o ./build/js/bot.js
cmd /C npx browserify -x ./static/cache.js ./src/toolbar.js -o ./build/js/toolbar.js

rd /S /Q "dist"
mkdir "dist"
echo Packing Extension
Powershell Compress-Archive -Path ./build/* -DestinationPath ./dist/PokecordBot.zip
ren ".\dist\PokecordBot.zip" "PokecordBot.xpi"

echo Done