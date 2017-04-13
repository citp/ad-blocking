# Perceptual Ad Blocker

This extension is a perceptual ad blocker which highlights advertisements on
Facebook and Adchoices advertisements across the web.

For Facebook ad detection, it finds newsfeed items by looking for containers within the given width constraints and border on the side; it looks for the sidebar ads by searching for containers with the proper size constraints in a sidebar. It then determines which newsfeed items are ads by searching for the "Sponsored" link within them and checking whether this link ultimately goes to the Facebook "about ads" page.

For Adchoices detection, it runs a content script in every iframe which searches all of the images,
(those explicit in an img element, those in the background-image css, and
those drawn as an svg) and then uses fuzzy hashing to compare them to example
Adchoices icons. If any of the images match, it highlights the iframe as
an advertisement.

# Code Overview

- *manifest.json* contains information about the overall structure of the extension as well as the title, version number, and description.
- *popup* is just a simple description of the extension that appears when the user clicks the icon in the upper right.
- *ad_highlighter.js* is the script that runs on facebook.com, searches for ads, and highlights them.
- *content.js* is the script that runs in iframes, searches for Adchoices images
and highlights the iframes if the Adchoices icon is found.
- *perceptualLibrary/link_clicker.js* contain the code that determines the ultimate result destination of clicking a link.
- *perceptualLibrary/container_finder.js* contains code that returns a list of containers conforming to various constraints, including width/height bounds or specific css properties but also more high-level things like whether the container is a sidebar or not.
- *perceptualLibrary/imageSearch.js* contains the perceptual code for detecting images of various kinds.
- *perceptualLibrary/check_text_and_link* contains code that searches for text and a link within a given container.
- *perceptualLibrary/adchoices_hashes.js* contains the hashes of adchoices icons to match.
- *perceptualLibrary/hash_encoding.js* contains the code that converts from the adchoices hashes (in hex) to binary.
- *perceptualLibrary/perceptual_background.js* contains the code that does the fuzzy image hashing and link destination detection.
- *locale_info.js* keeps information about the "Sponsored" text in various languages to support all Facebook locales.
- *utils.js* contains the code for covering advertisements once they have been identified
- *externalCode* contains jquery 1.12.4
- *actual_icons* contains the actual Adchoices icons.

# Running This Extension

To get this running from the source code on your local machine (Chrome only):

- navigate to "chrome://extensions"
- click the checkbox next to "Developer mode" in the upper right hand corner
- click the "Load unpacked extension..." button below the "Extensions" title
- select the “perceptual-adblocker” folder from your filesystem
- refresh any open Facebook pages


### License:
MIT
