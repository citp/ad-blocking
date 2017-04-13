/* ----------------------------------------------------------------------------------
 * Author: Grant Storey & Dillon Reisman
 * Written: 8/10/16
 * Last Updated: 3/7/17
 * Description: Highlights ads ("sponsored posts") in the Facebook news feed.
 * Dependencies: jquery, link_clicker.js, container_finder.js,
 * check_text_and_link.js, locale_info.js, util.js
 * ----------------------------------------------------------------------------------
 */

// The perceptual adblocker logic. 63 total lines with comments and empty
// lines removed.

// the substring present in the facebook ad page
var AD_PAGE_SUBSTRING = "https://www.facebook.com/ads/about";

// default to a list of "Sponsored" text for all known locales
var textPossibilities = TEXT_POSSIBILITIES_DEFAULT;


// find newsfeed ads on the page and apply the result function to them.
// When firstRun = true, this is the initialization run and container is
// just the document body.
// When firstRun = false, container is a new contianer added to the DOM,
// which is to be checked as an advertisement.
function findNewsfeedAds(container, firstRun, resultFunction) {
  // conditions for a newsfeed ad container.
  var adArgs = {
    "container": container,
    "includeContainer": !firstRun,
    "element": "div",
    "size": {
      "width": {"min": 450, "max": 550},
    },
    "cssMatches": [
      {"prop": "border-left-width", "val": "1px"},
      {"prop": "border-right-width", "val": "1px"}
    ]
  };
  var possibleNewsfeedAds = findContainers(adArgs);
  // possibleNewsfeedAds is the set of containers to search, we want to cover
  // every found container, we apply the resultFunction to matching containers,
  // the text to match is in textPossibilities and the link substring to match
  // is AD_PAGE_SUBSTRING.
  checkTextAndOrLink(possibleNewsfeedAds, false, resultFunction, textPossibilities, AD_PAGE_SUBSTRING);
}

// find the advertisements in the sidebar and apply the result function to them.
function findSidebarAds(container, firstrun, resultFunction) {
  // if this is the firstrun, we want to look at the sidebar, and only the one
  // with siblings (this will be the outermost container);
  // if this is not the firstrun, the container we are getting is
  // going to be some small subset of the DOM that doesn't include the
  // sidebar, so just look in the container.
  var adSearchArea = container;
  var properSiblings = null;
  if (firstrun) {
    var sidebarArgs = {
      "container": container,
      "element": "div",
      "isSidebar": true
    };
    adSearchArea = findContainers(sidebarArgs);
    properSiblings = {"min": 1, "max": null};
  }
  var adArgs = {
    "container": adSearchArea,
    "element": "div",
    "size": {
      "width": {"min": 225, "max": 325},
      "height": {"min": 225, "max": 550}
    },
    "hasSiblings": properSiblings
  };
  var possibleSidebarAds = findContainers(adArgs);
  // possibleNewsfeedAds is the set of containers to search, we want to cover
  // only the deepest matching container, we apply the resultFunction to
  // matching containers, the text to match is in textPossibilities and the link
  // substring to match is AD_PAGE_SUBSTRING.
  checkTextAndOrLink(possibleSidebarAds, true, resultFunction, textPossibilities, AD_PAGE_SUBSTRING);
}

// find newsfeed and sidebar ads, and apply the result function to them.
function findAds(container, firstRun, resultFunction) {
  if (container.find) {
    findNewsfeedAds(container, firstRun, resultFunction);
    findSidebarAds(container, firstRun, resultFunction);
  }
}

// determine the locale if possible
var res = getLocale();
if (res !== null) {
  textPossibilities = res;
}

function coverFunction(container, matchingText, deepestOnly) {
  return coverContainer(container, "THIS IS AN AD", matchingText, deepestOnly, true, false, null);
}

// initial run to cover the ads
findAds($("body"), true, coverFunction);

// this looks for changes in the DOM that correspond to new ads being
// displayed, and when that happens blocks those ads.
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // if content was added, examine the ads and look for new information
    if (mutation.addedNodes.length > 0) {
      findAds($(mutation.addedNodes), false, coverFunction);
    }
  });
});
observer.observe(document, {childList: true, subtree: true});
