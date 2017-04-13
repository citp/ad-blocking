/* ----------------------------------------------------------------------------------
 * Authors: Grant Storey & Dillon Reisman
 * Written: Dec '16
 * Last Updated: 3/7/17
 * Description: Content script that runs in iframes, determines whether they
 * contain an adchoices icon, and if so covers them with a red box that says
 * "Adchoices identified." Can optionally overlay non ads with "Adchoices not identified."
 * as well for testing purposes.
 * Dependencies: jquery, perceptual_background.js, image_search.js, utils.js.
 * ----------------------------------------------------------------------------------
 */

// The perceptual adblocker logic. 28 total lines with comments and empty
// lines removed.

// stores repeated check interval id to allow it to be canceled
var intervalID;

// This response is triggered by the background script.
// If the background script found adchoices, then response.element
// will have a stringified version of the dom element that triggered it.
var handleBkgdResponse = function(response) {
    if (typeof response === 'undefined'){
        return true;
    }
    if ('element' in response) {
        //console.log(response['element']);
        // cover the body, place text "ADCHOICES IDENTIFIED", no local info,
        // not only the deepest container, this is an ad, there is an interval,
        // and the interval's id is intervalID
        coverContainer($('body'), "ADCHOICES IDENTIFIED", "", false, true, true, intervalID);
    }
    else if ('no_element' in response) {
        //console.log('Not adchoices image!');
        // cover the body, place text "NOT ADCHOICES", no local info,
        // not only the deepest container, this is not an ad, there is an
        // interval, and the interval's id is intervalID
        coverContainer($('body'), "NOT ADCHOICES", "", false, false, true, intervalID);
    }
    return true;
};

// return whether this is in an iFrame
// http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// if we are in an iframe (which contains the vast majority of adchoices ads)
if (inIframe()) {
  // set an interval to check every 2 seconds. Probably
  // best to do some sort of DOM observer trigger for a production version
  // of this, but the interval works fine for demo purposes.

  intervalID = setInterval(function() {
      // Only consider the iframe if it is larger than 1x1
      if (document.body.clientWidth > 1 || document.body.clientHeight > 1) {
        // uncomment this for debugging to make sure that the container
        // with the adchoices icon has been examined at all.
        //$('body').addClass("CITPObserved");
        runImageSearch($('body'), handleBkgdResponse);
      }

  }, 2000);
}
