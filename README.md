# pokecord-bot

Auto leveling, catching and trading bot for pokecord

# status

This project was fun to make, however I am not interested anymore. Anyone is welcome to open a PR or continue work on this project.

# How to use?

1.  Clone the repo
2.  Run `npm run-script build`

-   On Chrome:
    1. Open the Extension Management page by navigating to chrome://extensions.
    -   The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
    2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
    3. Click the LOAD UNPACKED button and select the `build` directory.
-   On Firefox:
    1. Navigate to about:debugging.
    2. Find and press the `Load Temporary Add-on` button.
    3. Select the `manifest.json` in the `build` directory

4.  Open Discord in your browser and open the console. You should see `[PCB] Client Ready` with more instructions.

To update the hashes used for detecting pokemon open the console of the background script, call `calcHashes()`, wait for the process to finish and the copy the resulting json into `/src/data/hashes.js`

# branching

-   `master`
    -   `dev`
        -   `/feature/[Issue Nr]-[Name]`

For each US create a feature branch `/dev/feature/4-AutoLevelList` for example
Once US is finished and stable create pull request into dev.
Pull requests need to be approved by @Qendolin

# setup

Clone repo and run dev-setup.bat

# folder structre

MVC
use hyphens `-` and lower case for folder names
use PascalCase for files

#commits

[Issue Nr]: [Commit message]
