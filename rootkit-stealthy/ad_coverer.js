/* ----------------------------------------------------------------------------------
 * Author: Grant Storey;
 * Written: 12/26/16
 * Last Updated: 2/14/17
 * Description: Covers ads (as identified by easylist element hiding) with
 * white boxes.
 * Dependencies: jquery.
 * ----------------------------------------------------------------------------------
 */

var VERBOSE = false;

// contains the IDs for the new containers
var newBodyID = "WSA_New_Body";
var newHTMLID = "WSA_New_HTML";


// store the containers that covers will be placed in.
var sideContainer;
var fixedContainer;


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// return true if the container or any of its parents have fixed
// positioning.
function detectFixed(container) {
  // base case
  var tagName = container.prop("tagName").toLowerCase();
  if (tagName === "html") {
    return false;
  }

  var isFixed = (container.css("position") === "fixed");
  if (isFixed) {
    return true;
  } else {
    return detectFixed(container.parent());
  }
}

// return whether the container is already covered
function alreadyCovered(container) {
  return (container.find(".WSA_adBlockerCover").length > 0);
}

// return true if the container or any of its parents have display: none
function detectInvisible(container) {
  // base case
  var tagName = container.prop("tagName").toLowerCase();
  if (tagName === "html") {
    return false;
  }
  var isInvisible = (container.css("display") === "none");
  if (isInvisible) {
    return true;
  } else {
    return detectInvisible(container.parent());
  }
}

// return true if the container is not visible and should not be covered
function isInvisible(container) {
  return detectInvisible(container);
}

// given a list of divs, cover all of them with proper containers.
function coverContainer(container) {
  // Add a cover with "THIS IS AN AD" and the "Sponsored" text in the given
  // locale's language (if non-english).

  // don't cover if this container is already covered;
  if (false && alreadyCovered(container)) {
    return false;
  }

  if (isInvisible(container)) {
    return false;
  }

  var height = Math.max(container.outerHeight(), container.prop("scrollHeight"), container[0].clientHeight);
  var h = height + "px";
  var w = container.outerWidth() + "px";
  var x = "0";
  var y = "0";
  var offset = container.offset();
  var id = "WSA_cover_" + getRandomInt(0, Number.MAX_SAFE_INTEGER);
  var prepend = "<div class=\"WSA_adBlockerCover\" id=\"" + id + "\" style=\"height: " + h + ";position: absolute;top: " + y + ";left: " + x + ";overflow-y:hidden;width: " + w + ";background-color: rgba(255, 255, 255, 0.7);z-index: 100; visibility: visible;\">";
  prepend += "<div class=\"WSA_closeButton\" style=\"position: absolute; right: 5px; top: 5px; cursor: pointer; padding: 0px 3px; border: 1px solid black; border-radius: 5px;\">";
  prepend += "<strong>";
  prepend += "X";
  prepend += "</strong>";
  prepend += "</div>";
  prepend += "<div style=\"width: 100%;text-align:center;\">";
  prepend += "<span style=\"color: black; font-size:60px;\">";
  prepend += "THIS IS AN AD";
  prepend += "</span>";
  prepend += "</div>";
  prepend += "</div>";
  var myPrepend = prepend;


  // for tracking which containers covers correspond to
  //console.log(id + ": " + container[0].outerHTML);

  var targetContainer;
  if (detectFixed(container)) {
    targetContainer = fixedContainer;
  } else {
    targetContainer = sideContainer;//container;
  }

  //targetContainer.css("position", "relative");
  targetContainer.prepend(myPrepend);
  var cover = targetContainer.find("#" + id);
  cover.offset(offset);

  // reset as page changes
  var intervalID = setInterval(function() {
    var height = Math.max(container.outerHeight(), container.prop("scrollHeight"));
    var width = Math.max(container.outerWidth(), container.prop("scrollWidth"));
    cover.css("height", height + "px");
    cover.css("width", width + "px");

    var offset = container.offset();
    cover.offset(offset);

  }, 1000);
  targetContainer.find("#" + id + " .WSA_closeButton").on("click", function () {
    cover.css("visibility", "hidden");
    clearInterval(intervalID);
  });
}

// add "body" to the start of every selector
function addBody(cssText) {
  var split;
  var selectors;
  var styles;
  var meta;
  var atData;

  split = cssText.split("{");
  if (cssText.substring(0,1) == "@"){
    atData = split[0];
    selectors = split[1];
    styles = split[2];
    meta = true;
  } else {
    selectors = split[0];
    styles = split[1];
  }

  var selectorsSplit = selectors.split(",");
  var newSelectorsSplit = selectorsSplit.map(function(selector) {
    var newString;
    if (selector.substring(0,4) == "body") {
      newString = selector;
    } else {
      newString = "body " + selector;
    }
    return newString;
  });
  var newSelectors = newSelectorsSplit.join(",");

  var newStyles = styles;

  if (meta) {
    return atData + "{" + newSelectors + "{" + newStyles;
  } else {
    return newSelectors + "{" + newStyles;
  }
}

// given a function to apply to every selector, return a function that
// takes an entire rule and applies that function
function createCSSModifier(selectorFunction) {
  return function(cssText) {
    var split;
    var selectors;
    var styles;

    split = cssText.split("{");
    if (cssText.substring(0,1) == "@"){
      if ((cssText.substring(0,9) == "@document") || (cssText.substring(0,9) == "@supports") || (cssText.substring(0,6) == "@media"))
      {
        var split2 = cssText.split("}");
        var split3 = split2[0].split("{");


        var newString = "";
        var mediaPiece = split3[0] + "{";
        var firstRule = split3[1] + "{" + split3[2] + "}"
        newString += mediaPiece;
        newString += addNewBody(firstRule);
        for (var i = 1; i < split2.length - 2; i++) {
          newString += addNewBody(split2[i] + "}");
        }
        newString += "}";
        return newString;
      } else {
        return cssText;
      }
    } else {
      selectors = split[0];
      styles = split[1];
    }
    //
    var selectorsSplit = selectors.split(",");
    var newSelectorsSplit = selectorsSplit.map(function(selector) {
      var newString;
      selector = selector.trim();
      newString = selectorFunction(selector);
      return " " + newString;
    });
    var newSelectors = newSelectorsSplit.join(",");

    var newStyles = styles;

    return newSelectors + "{" + newStyles;
  };
}

// add the new body selector to the beginning of every rule;
var addNewBody = createCSSModifier(function(selector) {
  var newString;
  if (selector.substring(0,1) == "#") {
    // perhaps should check for attempted collision here, but that would
    // only ruin my stuff, not allow detection.
    return selector;
  }



  var prefix = "";

  if(selector.substring(0,5) == "html ") {
    prefix = "html ";
    selector = selector.substring(5);
  }

  if ((selector.substring(0,1) == "*") || (selector.substring(0,2) == "::")) {
    newString = selector;
  }
  else if (selector.substring(0,4) == "body") {
    newString = "#" + newBodyID + selector.substring(4);
  } else {
    newString = "#" + newBodyID + " " + selector;
  }
  var res = prefix + newString;

  // classes may apply to the body as well
  if (selector.substring(0,1) == ".") {
    res += ", #" + newBodyID + selector;
  }
  return res;
});

// adjust css rules for the new setup
var adjustForNewContainers = createCSSModifier(function(selector) {
  var newString;
  // fixes something on forbes
  if (selector.trim() == "[ng:cloak]") {
    return "[ng-cloak]"
  }
  var firstChar = selector.trim().substring(0,1);
  if ((firstChar == "#")) {
    // perhaps should check for attempted collision here, but that would
    // only ruin my stuff, not allow detection.
    return selector;
  }
  if (selector.trim().substring(0,18) == "#WSA_New_TopLevel") {
    return selector;
  }

  // replace instances of "html" and "body" with proper replacements.
  function replaceHTML(match, offset, string) {
    return match[0] + "#" + newHTMLID + match[5];
  }
  function replaceBody(match, offset, string) {
    return match[0] + "." + newBodyID + match[5];
  }

  // replace html, body with appropriate separate IDs
  var modifiedSelector = ((" " + selector + " ").replace(/[, ][hH][tT][mM][lL][,\.#:> \[]/g, replaceHTML).replace(/[, ][bB][oO][dD][yY][,\.#:> \[]/g, replaceBody)).substring(1);
  //WSA_New_Body
  //WSA_New_HTML
  var res = "#WSA_New_TopLevel " + modifiedSelector;

  return res;
});


// modify all the CSS Styles on the page using func;
function modifyCSSStyles(func) {
  for (var i = 0; i < document.styleSheets.length; i++){
    var styleSheet = document.styleSheets[i];
    if (styleSheet.cssRules) {
      if (!styleSheet.overWritten) {
        var len = styleSheet.cssRules.length;
        for (var j = 0; j < len; j++) {
          var rule = styleSheet.cssRules[j];
          styleSheet.deleteRule(j);
            var result = func(rule.cssText);
            try {
              styleSheet.insertRule(result, j);
            }
            catch (e) {
              console.log("error on rule:\n" + "\"" + rule.cssText + "\"\n" + "\"" + result + "\"");
              styleSheet.insertRule("#WSA_New_TopLevel {}", j);
            }
        }
        var oldIR = styleSheet.insertRule;

        styleSheet.insertRule = function(rule, index) {
          console.log("adding css rule:" + rule);
          oldIR(func(rule), index);
        }

        styleSheet.overWritten = true;
      }
    }
  }
}
// modify all CSS Styles
function printCSSStyles() {
  for (var i = 0; i < document.styleSheets.length; i++){
    var styleSheet = document.styleSheets[i];
    console.log("===========================")
    console.log("Stylesheet (" + styleSheet.title + ")");
    if (styleSheet.cssRules) {
      for (var j = 0; j < styleSheet.cssRules.length; j++) {
        var rule = styleSheet.cssRules[j];
        console.log("  cssText: " + rule.cssText);
      }
    }
  }
}


// given a container, hide it.
function hideContainer(container) {
  //container.css("visibility", "hidden");
  container.css("display", "none");
}

// given a container, remove it
function removeContainer(container) {
  container.remove();
}

var selectorsGrabbed = false;
var selectorsString = null;
var exceptionsString = null;

// get the list of ads and apply func to each of them
function actOnAds(func) {
  var resultAction = function () {
    var containers = $(selectorsString);
    var containersWithExceptions;
    if (exceptionsString != "") {
      containersWithExceptions = containers.filter(function () {
        return !$(this).is(exceptionsString);
      });
    } else {
      containersWithExceptions = containers;
    }
    // clear old Covers; TODO: probably a less intensive way to avoid
    // covering previous ads
    fixedContainer.html("");
    sideContainer.children(".WSA_adBlockerCover").remove();

    containersWithExceptions.each(function (index, container) {
      func($(container));
    });
  }
  if (selectorsGrabbed) {
    if (VERBOSE) {
      console.log("Selectors already loaded");
    }
    resultAction();
  } else {
    if (VERBOSE) {
      console.log("Selectors not yet loaded, loading now.");
    }
    chrome.runtime.sendMessage({type: "selectors"}, function(response) {
      if (response && response.selectors && (response.exceptions != null)) {
        selectorsGrabbed = true;
        selectorsString = response.selectors;
        exceptionsString = response.exceptions;
        resultAction();
      }
    });
  }

}

newHTMLID = window.document.body.lastElementChild.lastElementChild.id;

sideContainer = $("#WSA_Cover_Container");
fixedContainer = $("#WSA_Fixed_Container")

modifyCSSStyles(adjustForNewContainers);

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes && mutation.addedNodes[0]) {
      mutation.addedNodes.forEach(function(node) {
        var name = node.nodeName.toLowerCase();
        if(name == "style" || name == "link") {
          modifyCSSStyles(adjustForNewContainers);
        }
      });
    }
  });
});

var config = {childList: true, subtree: true};

observer.observe(window.document.body.parentElement, config);

// load the selector string;
actOnAds(function () {});


// obviously a more advanced version of this would look for changes in
// the dom and apply the filters selectively then rather than this interval,
// but for a proof-of-concept this is decent.
intervalID = setInterval(function() {
  console.log("covering");
  var actionFunction = coverContainer;
  actOnAds(actionFunction);
}, 2000);
