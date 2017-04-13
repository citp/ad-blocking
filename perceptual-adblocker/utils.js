/* ----------------------------------------------------------------------------------
 * Authors: Grant Storey & Dillon Reisman
 * Written: 3/5/17
 * Last Updated: 3/7/17
 * Description: Helper code for covering advertisements that have been found.
 * Dependencies: jquery.
 * ----------------------------------------------------------------------------------
 */

// sets logging level
var VERBOSE = false;

if (typeof NON_ENGLISH_LOCALE === 'undefined') {
  var NON_ENGLISH_LOCALE = false;
}

// return whether the container is already covered
function alreadyCovered(container) {
  return (container.find(".FAH_adBlockerCover").length > 0);
}

// true if we want to overlay non-ads as well
var showNonAd = false;

// return whether the container is already covered by the same type
// of container. That is, if there is already an ad or non-ad container
// we don't want to ad a container of a new type, but if an adchoices
// icon has been added and it changed from non-ad to ad, we do want
// to update.
function alreadyCoveredSameType(container, newCoverIsAd) {
  var alreadyCovered = (container.find(".CITP_adBlockerCover").length > 0);
  var alreadyAd = (container.find(".CITP_isAnAd").length > 0)
  return alreadyCovered && (alreadyAd || !newCoverIsAd);
}

// Add a cover with "THIS IS AN AD" and the "Sponsored" text in the given
// locale's language (if non-english).
// container is the container to cover.
// coverText is the text to show on the cover
// matchingText only has a value if we are on Facebook in a non-english locale.
// deepestOnly is true if we only want to include the deepest cover for this
// area.
// isAd is true if it is an ad
// hasInterval is true if there is an interval check associated with this cover
// intervalID is the id of that interval
function coverContainer(container, coverText, matchingText, deepestOnly, isAd, hasInterval, intervalID) {
    // if we aren't doing anything to non-ads and this isn't an ad, do nothing.
    if (!isAd && !showNonAd) {
      return false;
    }

  // don't cover if this container is already covered;
  if (alreadyCoveredSameType(container, false)) {
    return false;
  }

  // remove any existing covers (if we are moving from non-ad to ad)
  container.find(".CITP_adBlockerCover").remove();

  // vary the color and classes based on whether this is an ad or not.
  var color;
  var classes = "CITP_adBlockerCover";
  if (isAd) {
    if (showNonAd) {
      color = "rgba(255, 0, 0, 0.8)";
    } else {
      color = "rgba(255, 255, 255, 0.8)";
    }
    classes += " CITP_isAnAd";
  } else {
    color = "rgba(255, 255, 255, 0.8)";
  }

  // some google ads have a height of 0 and then everything in overflow,
  // so if that is the case set the height of the cover to be the overflow
  // height.
  var setHeight;
  var containerHeight = container.height();
  var containerScrollHeight = container.prop('scrollHeight');
  if (containerHeight == 0 && containerScrollHeight > 0) {
    setHeight = containerScrollHeight;
  } else {
    setHeight = "100%"
  }

  // create the cover to prepend.
  var prepend = "<div class=\"" + classes + "\" style=\"height: " + setHeight + ";position: absolute;width: 100%;background-color: " + color + " !important;z-index: 100; visibility: visible;\">";
  prepend += "<div class=\"FAH_closeButton\" style=\"position: absolute; right: 5px; top: 5px; cursor: pointer; padding: 0px 3px; border: 1px solid black; border-radius: 5px;\">";
  prepend += "<strong>";
  prepend += "X";
  prepend += "</strong>";
  prepend += "</div>";
  prepend += "<div style=\"width: 100%;text-align:center;\">";
  prepend += "<span style=\"color: black; font-size:60px;\">";
  prepend += coverText;
  prepend += "</span>";
  // if we have "Sponsored" text in another language, add it below "THIS IS AN AD"
  if (NON_ENGLISH_LOCALE && matchingText !== "") {
    prepend += "<br/>"
    prepend += "<span style=\"color: black; font-size:40px; background: rgba(255,255,255,.8);\">";
    prepend += "(" + matchingText + ")";
    prepend += "</span>";
  }
  prepend += "</div>";
  prepend += "</div>";
  var myPrepend = prepend;

  // if we only want the deepest, remove any above this
  if (deepestOnly) {
    container.parents().each(function (index) {
      $(this).children(".FAH_adBlockerCover").remove();
    });
  }
  // if we only want the deepest covers and there is a cover within
  // this container already, don't ad this cover.
  if (!deepestOnly || !(container.find(".FAH_adBlockerCover").length > 0)) {
    // prepend the cover
    container.css("position", "relative");
    container.prepend(myPrepend);

    // make sure the close button closes the cover
    container.children().children(".FAH_closeButton").on("click", function () {
      container.children(".FAH_adBlockerCover").css("visibility", "hidden");
    });
  }


  // if this is an ad and we have an interval, stop the search for ads.
  if (hasInterval && isAd) {
    clearInterval(intervalID);
  }
}

/******************************************************
***** Demo of link clicking by x/y coordinate. This will work on a logged-in
***** facebook.com page.
***** The code clicks on the user's profile in the top bar.
*/
/*
setTimeout(function() {

    simulateClickByPoint(502,21);

}, 5000);
*/
