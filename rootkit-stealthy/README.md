# Stealthy Whitespace Adblocker

This extension uses easylist element hiding filters to highlight advertisements
(by covering them with white containers), while taking a variety of actions to
make itself as stealthy as possible (up to the limit allowed by the browser).


# Code Overview

- *manifest.json* contains information about the overall structure of the extension as well as the title, version number, and description.
- *popup* is just a simple description of the extension that appears when the user clicks the icon in the upper right.
- *ad_coverer.js* is the script that searches for ads, and highlights them, as well as overwriting the CSS for the page.
- *background.js* loads the set of filters to block for each page.
- *easylist.txt* contains EasyList
- *eraseFootprint.js* modifies the html of the page to place the body into a fake body for stealth, then overwrites Javascript functions to further cover its tracks.
- *externalCode* contains jquery 1.12.4

# Running This Extension

To get this running from the source code on your local machine (Chrome only):

- navigate to "chrome://extensions"
- click the checkbox next to "Developer mode" in the upper right hand corner
- click the "Load unpacked extension..." button below the "Extensions" title
- select the “rootkit-stealthy” folder from your filesystem
- refresh any open pages


### License:
MIT
