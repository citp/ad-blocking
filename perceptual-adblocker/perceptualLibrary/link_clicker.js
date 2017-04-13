/* ----------------------------------------------------------------------------------
 * Authors: Grant Storey & Dillon Reisman
 * Written: Dec '16
 * Last Updated: 3/5/17
 * Description: Helper code for link click simulation.
 * Dependencies: jquery.
 * ----------------------------------------------------------------------------------
 */

// Link clicking function; take an href and a handler function to process
// the result.
function followSingleHref(href, handler) {
  chrome.runtime.sendMessage({link: href}, function(response) {
    if(response) {
      var result = response.finalLinkDestination;
      handler(result);
    }
  });
}


/*
 * This sample module implements link clicking by x,y coordinate.
 * The corresponding background scripts will collect the URLs resulting
 * from the click, even as it follows redirects.
 */
function simulateClickByPoint(x, y) {
    chrome.runtime.sendMessage({startURLCollector: true});

    // Set an invisible iframe to load links for data collection.
    $('head').append("<base target='invisible_frame'></base>");
    $('body').append("<iframe name='invisible_frame' style='width:0;height:0;border:0; border:none;'></iframe>");
    setTimeout(function(){
        $(document.elementFromPoint(x,y)).click();
        $('base').removeAttr('target');
    }, 500);
}
