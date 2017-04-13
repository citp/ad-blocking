# Signature-Based Active Adblocker (Firefox Extension)
An implementation of a signature-based active ad blocker, this tool allows circumvention of ad blocker detectors that detect the Firefox version of [Adblock Plus](https://adblockplus.org/) on 49 different websites (note that when compared to our proxy version, it leads to crashes on two websites).

**Please Note:** this is an academic proof-of-concept of what is technologically possible in the ad blocking wars.

The default list of signatures is in filterList.csv; the user can also load the filter list from another file if they choose. All of the default filters worked on 3/13/16, but please note that this is a rapidly changing field so there might be breakage.

*filterList.csv* contains the list of sites and replacements
*signatureBasedActiveAdblocker.py* contains the code for the replacements

## How to Run

1. Navigate to the folder in terminal
2. Run `jpm run`
3. Download AdBlock Plus in the version of Firefox that runs
4. Enable the extension by clicking its icon in the upper right corner
5. Visit one of the above sites with Adblock Plus running and witness the lack of anti-ad block messages. You might want to visit the websites without the active ad blocker running first to see what defenses they utilize.


### License:
MIT
