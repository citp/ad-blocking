/* ----------------------------------------------------------------------------------
 * Authors: Grant Storey & Dillon Reisman
 * Written: October '16
 * Last Updated: 3/7/17
 * Description: Given a set of possible ads, some text and a url to find,
 * determine whether those ads contain the text and/or a link whose ultimate
 * destination is that url.
 * Dependencies: jquery, perceptual_background.js, image_search.js, utils.js.
 * ----------------------------------------------------------------------------------
 */

 // constants for testing the Facebook highlighting portion.
var CONSTANTS = {
 "COVER": {
   "AND": "coverConstantAnd",
   "OR": "coverConstantOr",
   "TEST": "coverConstantTest"
 }
}

// by default, require both the sponsored text and a link that results in
// the ad page.
var COVER_TYPE = CONSTANTS.COVER.OR;


// mark the container as found by the "or" or "and" search method.
function markContainer(container, marking) {
  var markString = "markedBy" + marking;
  container.addClass(markString);
  container.addClass("FAHMarked");
}

// select ads from a list of possible ads based on whether they have
// text from the given list or a link resulting in the given destination,
// then apply resultFunction to the matching containers.
// deepestOnly is true if we want to only cover the deepest of a set of
// containers.
function checkTextAndOrLink(possibleAds, deepestOnly, resultFunction, textMatches, hrefString) {
  //
  // contains the locale's sponsored text;
  var matchingText = "";
  // for each possible ad, check whether it is an ad and, if so, cover it.
  possibleAds.each(
    function() {
      var me = $(this);

      // also make sure not to add the cover to an advertisement that already
      // has the cover.
      if (alreadyCovered(me)) {
        return false;
      }

      var childLinks = me.find("a");
      // select only links whose text matches the "Sponsored" text for this
      // locale, or the text for any locale if no individual locale has been
      // determined.
      var sponsoredTextLinks = childLinks.filter(
        function(index) {
          // Make sure that text added dynamically via the CSS pseudoselectors
          // :before and :after is included in the text checked.
          var before = window.getComputedStyle($(this).get(0),':before').getPropertyValue("content").replace(/\"/g, "");
          var after = window.getComputedStyle($(this).get(0),':after').getPropertyValue("content").replace(/\"/g, "");
          var text = $(this).text();
          var fullText = before + text + after;

          // if we are using the "or" method or testing, grab the href of this
          // link and if it results in the faebook ad page, cover the container.
          if ((COVER_TYPE == CONSTANTS.COVER.OR) || (COVER_TYPE == CONSTANTS.COVER.TEST)) {
            var href = $(this).attr("href");
            followSingleHref(href, function(result) {
              var includesSubstring = result.includes(hrefString);
              if (includesSubstring) {
                resultFunction(me, matchingText, deepestOnly);
                // if we are testing, mark this container as covered by "or"
                if (COVER_TYPE == CONSTANTS.COVER.TEST) {
                  markContainer(me, CONSTANTS.COVER.OR)
                }
              }
            });
          }
          // if this link contains one of the sponsored text names, return
          // true that this is a "sponsored" link.
          // If we are in the "and" method or testing, check if the link results
          // in the ad page, and if so cover the ad.
          if (textMatches.indexOf(fullText) !== -1) {
            matchingText = fullText;
            if ((COVER_TYPE == CONSTANTS.COVER.AND) || (COVER_TYPE == CONSTANTS.COVER.TEST)) {
              var href = $(this).attr("href");
              followSingleHref(href, function(result) {
                var includesSubstring = result.includes(hrefString);
                if (includesSubstring) {
                  resultFunction(me, matchingText, deepestOnly);
                  // if we are testing, mark this ad as covered by "and"
                  if (COVER_TYPE == CONSTANTS.COVER.TEST) {
                    markContainer(me, CONSTANTS.COVER.AND)
                  }
                }
              });
            }
            return true;
          } else {
            return false;
          }
        }
      );

      // if the div has the sponsored text and we are using the "or" method
      // or testing, cover the container.
      if (((COVER_TYPE == CONSTANTS.COVER.OR) || (COVER_TYPE == CONSTANTS.COVER.TEST)) && sponsoredTextLinks.length > 0) {
        resultFunction(me, matchingText, deepestOnly);
        // if we are testing, mark the container as covered by "or"
        if (COVER_TYPE == CONSTANTS.COVER.TEST) {
          markContainer(me, CONSTANTS.COVER.OR)
        }
      }
    }
  );
}
