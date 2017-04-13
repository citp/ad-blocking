# Signature-Based Active Adblocker
An implementation of a signature-based active ad blocker, this tool allows circumvention of ad blocker detectors that detect the Chrome version of [Adblock Plus](https://adblockplus.org/) on 51 different websites. This active ad blocker runs with [mitmproxy](https://mitmproxy.org/) 1.0.2 by modifying the ad blocker detector scripts as they are downloaded in order to prevent the detection scripts from properly working.

**Please Note:** this is an academic proof-of-concept of what is technologically possible in the ad blocking wars.

This tool works on a list of 51 websites as a mitmproxy script.
All of these worked on 3/5/16, but please note that this is a rapidly changing field so there might be breakage.

*filterList.csv* contains the list of sites and replacements
*signatureBasedActiveAdblocker.py* contains the code for the replacements

## How to Run

1. Download [mitmproxy](https://mitmproxy.org/) and set up your computer to properly route traffic through it when necessary.
2. In terminal, navigate to the folder containing signatureBasedActiveAdblocker.py
3. Run `mitmdump -s "signatureBasedActiveAdblocker.py" --anticache`
4. Visit one of the above sites in Chrome with Adblock Plus running and witness the lack of anti-ad block messages. You might want to visit the websites without the active ad blocker running first to see what defenses they utilize.
5. Note: you may have to clear the cache to get properly modified scripts.


### License:
MIT
