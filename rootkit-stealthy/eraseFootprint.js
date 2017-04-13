/* ----------------------------------------------------------------------------------
 * Author: Grant Storey;
 * Written: 12/26/16
 * Last Updated: 1/12/17
 * Description: Background page that sets up elements to hide.
 * Dependencies: easylist.txt
 * ----------------------------------------------------------------------------------
 */

 // this script makes sure that as soon as the DOM is loaded,
// a script is injected to rootkit the Javascript API and
// make adblocking more stealthy by hiding various activities of
// the adblocker (where possible within the current contrains of javascript)

// iframe tester
// http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
function inIframe () {
  try {
      return window.self !== window.top;
  } catch (e) {
      return true;
  }
}

// add all attributes from html to fake html and body to fake body
//http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery
function copyHTML(fakeHTML) {
  $("html").each(function() {
    $.each(this.attributes, function() {
      if(this.specified) {
        fakeHTML.attr(this.name, this.value);
        $("html").attr(this.name, "");
      }
    });
  });
}
function copyBody(fakeBody) {
  $("body").each(function() {
    $.each(this.attributes, function() {
      if(this.specified) {
        fakeBody.attr(this.name, this.value);
        $("body").attr(this.name, "");
      }
    });
  });
}

// run as soon as the body is loaded.
function startRun() {
  var scriptText = `
  (function() {

    var realHTML = window.document.body.parentElement;
    var realHead = realHTML.firstElementChild;
    var realBody = window.document.body;

    var fakeHTML = window.document.body.lastElementChild.lastElementChild;
    var fakeBody = window.document.body.lastElementChild.lastElementChild.lastElementChild;


    /*
    Object.defineProperty(object, propertyName, {
      get: (function() {
        return function() {
          return "bleh";
        }
      })()
    });*/

    // https://github.com/WSA/OpenWPM/blob/a0638550f019e04e91ae926429dc5c33da808b64/automation/Extension/firefox/data/content.js#L463-L556
    // Object.getOwnPropertyDescriptor(newHTML, "tagName")
    // toString


    // these functions allow overwriting of various properties associated
    // with HTML.

    // replace the getter with a single value
    function simpleReplaceGet(obj, prop, val) {
      var getter = function() {
        return val;
      };
      Object.defineProperty(obj, prop, {
        get: (function() {
          return getter;
        })()
      });
    }
    // replace the getter with a simple function
    function functionReplaceGet(obj, prop, func) {
      Object.defineProperty(obj, prop, {
        get: (function() {
          return func;
        })()
      });
    }


///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    // overwrite the toString so that our new values are hidden;
    var oldTs = Function.prototype.toString
    Function.prototype.toString = function() {
      var val = oldTs.apply(this);
      if (val.indexOf("var hideTrueToStringValue = true;") !== -1) {
        return val.substring(0, val.indexOf("{")) + "{ [native code] }";
      } else {
        return val
      }
    }

    // Rough implementations of Object.getPropertyDescriptor and Object.getPropertyNames
    // See http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (pd === undefined && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };

    // modify properties of prototypes and objects
    function instrumentObjectProperty(object, objectName, propertyName, canBeModified, getTransform, setTransform=function(newVal){return newVal;}) {

      // Store original descriptor in closure
      var propDesc = Object.getPropertyDescriptor(object, propertyName);
      if (!propDesc){
        console.error("Property descriptor not found for", objectName, propertyName, object);
        return;
      }

      // Instrument data or accessor property descriptors
      var originalGetter = propDesc.get;
      var originalSetter = propDesc.set;
      var originalValue = propDesc.value;

      var getFunc = (function() {
        return function() {
          var origProperty;

          // get original value
          if (originalGetter) { // if accessor property
            origProperty = originalGetter.call(this);
          } else if ('value' in propDesc) { // if data property
            origProperty = originalValue;
          } else {
            console.error("Property descriptor for",
                          objectName + '.' + propertyName,
                          "doesn't have getter or value?");
            return;
          }
          var newVal = getTransform(origProperty);
          //console.log("get. Old: \\"" + origProperty + "\\". New: \\"" + newVal + "\\".");
          return newVal;
        }
      })();

      var setFunc = (function() {
        return function(value) {
          var returnValue;
          var newVal = setTransform(value);
          //console.log("set. Old: \\"" + value + "\\". New: \\"" + newVal + "\\".");

          // set new value to original setter/location
          if (originalSetter) { // if accessor property
            returnValue = originalSetter.call(this, newVal);
          } else if ('value' in propDesc) { // if data property
            originalValue = newVal;
            returnValue = newVal;
          } else {
            console.error("Property descriptor for",
                          objectName + '.' + propertyName,
                          "doesn't have setter or value?");
            return newVal;
          }

          // return new value
          return returnValue;
        }
      })();

      if(canBeModified) {
        // We overwrite both data and accessor properties as an instrumented
        // accessor property
        Object.defineProperty(object, propertyName, {
          configurable: true,
          get: getFunc,
          set: setFunc
        });
      } else {
        // We overwrite both data and accessor properties as an instrumented
        // accessor property
        Object.defineProperty(object, propertyName, {
          configurable: true,
          get: getFunc
        });
      }
    }

    // fakeBody - tagName; outerHTML (remove div; id); nodeName; localName; attributes; classList; className; id; previousElementSibling; previousSibling;

    simpleReplaceGet(fakeBody, "tagName", "BODY");
    simpleReplaceGet(fakeBody, "nodeName", "BODY");
    simpleReplaceGet(fakeBody, "localName", "body");
    simpleReplaceGet(fakeBody, "previousElementSibling", realHead);
    simpleReplaceGet(fakeBody, "previousSibling", realHead);
    // don't return the body id if that is the only thing
    instrumentObjectProperty(fakeBody, "Fake Body", "id", false, function(oldVal) {if (oldVal == "WSA_New_Body") {return ""} return oldVal});
    instrumentObjectProperty(fakeBody, "Fake Body", "className", true, function(oldVal) {return oldVal.substring(13);}, function(oldVal) {return "WSA_New_Body " + oldVal});

    // modify outerHTML getter to have proper setup
    var outerGetModifier = function(oldVal) {
      return oldVal.replace(/<div/i, "<body").replace(/<\\/div>$/i, "<\\/body>").replace(/WSA_New_Body/g, "").replace(/id=\\"\\"/, "").replace(/class=\\"\\"/, "");
    };
    // modify outerHTML inputs to have the proper setup
    var outerSetModifier = function(oldVal)
    {
      var tmp = oldVal;
      var start = /<[^>]*/.exec(tmp)[0];
      // true if there are classes
      if(/class=\\"/.test(start)) {
        tmp = tmp.replace(/class=\\"/i, "class=\\"WSA_New_Body ");
      } else {
        tmp = tmp.replace(/<body/i, "<body class=\\"WSA_New_Body\\"");
      }
      // true if there is an id
      if(!(/id=\\"/.test(start))) {
        tmp = tmp.replace(/<body/i, "<body id=\\"WSA_New_Body\\"");
      }
      tmp = tmp.replace(/<body/i, "<div").replace(/<\\/body>$/i, "<\\/div>");
      return tmp;
    };
    instrumentObjectProperty(fakeBody, "Fake Body", "outerHTML", true, outerGetModifier, outerSetModifier);

    // full stealth would require overwriting both attributes and classList to
    // hide the extra ID and classname.


    // fakeHTML - tagName; parentNode; parentElement; outerHTML (remove div; id for both this and inner); nodeName; localName; innerHTML (remove div; id for inner); childNodes; children; firstChild; firstElementChild; attributes; id;

    // fakeHTML - outerHTML (remove div; id for both this and inner); innerHTML (remove div; id for inner);
    simpleReplaceGet(fakeHTML, "tagName", "HTML");
    simpleReplaceGet(fakeHTML, "nodeName", "HTML");
    simpleReplaceGet(fakeHTML, "localName", "html");
    simpleReplaceGet(fakeHTML, "parentNode", document);
    simpleReplaceGet(fakeHTML, "parentElement", null);
    simpleReplaceGet(fakeHTML, "firstChild", realHead);
    simpleReplaceGet(fakeHTML, "firstElementChild", realHead);
    simpleReplaceGet(fakeHTML, "childElementCount", 2);

    // .childNodes and .children are both "live" (connected to the dom) so
    // for full stealth they would need to be overwritten to hide the fact
    // that head is not actually a child of this fake HTML
    // to fix a quick breakage issue here

    var oldIB = fakeHTML.insertBefore;
    fakeHTML.insertBefore = function(newEl, el) {
      var hideTrueToStringValue = true;
      return oldIB.call(this, newEl, fakeBody);
    }


    // don't return the body id if that is the only thing
    instrumentObjectProperty(fakeHTML, "Fake HTML", "id", false, function(oldVal) {if (oldVal == "WSA_New_HTML") {return ""} return oldVal});

    // modify innerHTML getter to have proper setup
    var innerGetModifier = function(oldVal) {
      return realHead.outerHTML + oldVal.replace(/<div/i, "<body").replace(/<\\/div>$/i, "<\\/body>").replace(/WSA_New_Body/g, "").replace(/id=\\"\\"/, "").replace(/class=\\"\\"/, "");
    };
    // modify innerHTML inputs to have the proper setup
    var innerSetModifier = function(oldVal)
    {
      var tmp = oldVal;
      var first = /.*<\\/head>/.exec(tmp)[0];
      var second = /<body.*/.exec(tmp)[0];
      var start = /<[^>]*/.exec(second)[0];
      console.log(first);
      console.log(second);
      console.log(start);
      // true if there are classes
      if(/class=\\"/.test(start)) {
        second = second.replace(/class=\\"/i, "class=\\"WSA_New_Body ");
      } else {
        second = second.replace(/<body/i, "<body class=\\"WSA_New_Body\\"");
      }
      // true if there is an id
      if(!(/id=\\"/.test(start))) {
        second = second.replace(/<body/i, "<body id=\\"WSA_New_Body\\"");
      }
      second = second.replace(/<body/i, "<div").replace(/<\\/body>$/i, "<\\/div>");
      realHead.outerHTML = first;
      return second;
    };
    instrumentObjectProperty(fakeHTML, "Fake Body", "innerHTML", true, innerGetModifier, innerSetModifier);


    // modify innerHTML getter to have proper setup
    var outerGetModifier = function(oldVal) {
      var start = /<[^>]*/.exec(oldVal)[0];
      return start.replace(/<div/i, "<html").replace(/WSA_New_HTML/g, "").replace(/id=\\"\\"/, "") + ">" + realHead.outerHTML + fakeBody.outerHTML + "</html>";
    };
    // modify innerHTML inputs to have the proper setup
    var outerSetModifier = function(oldVal)
    {
      var first = /<[^>]*/.exec(oldVal)[0];
      var inner = /<head.*<\\/body>/.exec(oldVal)[0];

      var tmp = first;
      var start = /<[^>]*/.exec(tmp)[0];
      // true if there are classes
      // true if there is an id
      if(!(/id=\\"/.test(start))) {
        tmp = tmp.replace(/<html/i, "<html id=\\"WSA_New_HTML\\"");
      }
      tmp = tmp.replace(/<html/i, "<div").replace(/<\\/html>$/i, "<\\/div>");
      return tmp + ">" + innerSetModifier(inner) + "</div>";
    };
    instrumentObjectProperty(fakeHTML, "Fake Body", "outerHTML", true, outerGetModifier, outerSetModifier);


    // full stealth would require overwriting .attributes and classList to
    // hide the extra ID.



    // head - nextElementSibling, nextSibling, parentElement, parentNode

    simpleReplaceGet(realHead, "nextElementSibling", fakeBody);
    simpleReplaceGet(realHead, "nextSibling", fakeBody);
    simpleReplaceGet(realHead, "parentElement", fakeHTML);
    simpleReplaceGet(realHead, "parentNode", fakeHTML);

    // document - all; body; childNodes; children; documentElement; firstChild?; firstElementChild; lastChild; lastElementChild; scrollingElement; styleSheets;

    var oldChildNodes = document.childNodes;
    var newChildNodes = [oldChildNodes[0], fakeHTML];
    simpleReplaceGet(document, "childNodes", newChildNodes);
    simpleReplaceGet(document, "children", [fakeHTML]);
    simpleReplaceGet(document, "documentElement", fakeHTML);
    simpleReplaceGet(document, "firstElementChild", fakeHTML);
    simpleReplaceGet(document, "lastChild", fakeHTML);
    simpleReplaceGet(document, "lastElementChild", fakeHTML);
    simpleReplaceGet(document, "body", fakeBody);
    simpleReplaceGet(document, "scrollingElement", fakeBody);
    functionReplaceGet(document, "all", function() {
      var htmlArr = [fakeHTML];
      var headArr = [realHead];
      var headChildrenArr = Array.prototype.slice.call(realHead.querySelectorAll("*"));
      var bodyArr = [fakeBody];
      var bodyChildrenArr = Array.prototype.slice.call(fakeBody.querySelectorAll("*"));
      var finalArr = htmlArr.concat(headArr, headChildrenArr, bodyArr, bodyChildrenArr);
      return finalArr;
    });

    // document - styleSheets;
    // In order to achieve full stealth, one would also need to keep copies
    // of the unmodified stylesheets and return those instead of the modified
    // ones. But the fact that the detector knows the stylesheets have been
    // modified doesn't show them that this is actually adblocking.


    // overwrite functions on document

    // overwrite getElementById, which shouldn't return any of our elements
    var oldGEBI = document.getElementById;
    document.getElement = function(str) {
      var hideTrueToStringValue = true;
      if ((str == "WSA_Cover_Container") || (str == "WSA_New_Body") || (str.substring(0,11) == "WSA_cover_")) {
        return null;
      } else {
        return oldGEBI(str);
      }
    }


    var oldGEBCN = document.getElementsByClassName.toString();
    var oldGEBTN = document.getElementsByTagName.toString();
    var oldGEBTNNS = document.getElementsByTagNameNS.toString();
    var oldQS = document.querySelector.toString();
    var oldQSA = document.querySelectorAll.toString();

    document.getElementsByClassName = function(a) {var hideTrueToStringValue = true; var ret = fakeBody.getElementsByClassName(a); if (fakeBody.matches("."+a)) {if (!ret || !ret.splice) {return [fakeBody]}; ret.splice(0, 0, fakeBody);} return ret;};
    document.getElementsByTagName = function(a) {var hideTrueToStringValue = true; if(a.toLowerCase() == "html") {return [fakeHTML]} if(a.toLowerCase() == "head") {return realHTML.getElementsByTagName(a);} var ret = fakeBody.getElementsByTagName(a); if(a.toLowerCase() == "body") {if (!ret || !ret.splice) {return [fakeBody]}; ret.splice(0, 0, fakeBody);} return ret;};
    document.getElementsByTagNameNS = function(ns, a) {var hideTrueToStringValue = true; if(a.toLowerCase() == "html") {return [fakeHTML]} if(a.toLowerCase() == "head") {return realBody.getElementsByTagNameNS(ns, a);} var ret = fakeBody.getElementsByTagNameNS(ns, a); if(a.toLowerCase() == "body" && fakeBody.isDefaultNamespace(ns)) {if (!ret || !ret.splice) {return [fakeBody]}; ret.splice(0, 0, fakeBody);} return ret;};
    document.querySelector = function(a) {var hideTrueToStringValue = true; if(a.toLowerCase() == "html") {return fakeHTML} if(a.toLowerCase() == "head") {return realHead;}  if(fakeBody.matches(a)) {return fakeBody} return fakeBody.querySelector(a);};
    // this slows a lot of things down significantly because it is no longer native code;
    document.querySelectorAll = function(a) {var hideTrueToStringValue = true; if(a.toLowerCase() == "html") {return [fakeHTML]} if(a.toLowerCase() == "head") {return [realHead];}  var ret = fakeBody.querySelectorAll(a); if(fakeBody.matches(a)) {if (!ret || !ret.splice) {return [fakeBody]}; ret.splice(0, 0, fakeBody);} return ret;};

    // getElementsByName() doesn't need to be overwritten because it will
    // return the same thing either way;

    // elementFromPoint(); would need the experimental elementsFromPoint to
    // return the highest non-adblocking element.

  })();


  `;

  /*
  var script = document.createElement('script');
  script.innerHTML = scriptText;
  var body = window.document.body;
  // from http://clubmate.fi/append-and-prepend-elements-with-pure-javascript/
  body.insertBefore(script, body.firstChild);
  */

  $("body").wrapInner("<div id=\"WSA_New_TopLevel\"><div id=\"WSA_New_HTML\"><div id=\"WSA_New_Body\"></div></div></div>");

  copyHTML($("#WSA_New_HTML"));
  copyBody($("#WSA_New_Body"));
  $("#WSA_New_Body").addClass("WSA_New_Body");

  // overwrite the defaults
  $("body").css("margin", "0px");


  /*
  $("body").attr("class").split(' ').forEach(function(c) {$("#WSA_New_Body").addClass(c)});
  $("body").attr("class", "");*/
  $("body").prepend("<div id=\"WSA_Cover_Container\" style=\"position: absolute; right: 0px; top: 0px; width: 0; height: 0; z-index: "+ Number.MAX_SAFE_INTEGER + "\"></div>");
  $("#WSA_Cover_Container").prepend("<div id=\"WSA_Fixed_Container\" style=\"position: fixed; right: 0px; top: 0px; width: 0; height: 0; z-index: "+ Number.MAX_SAFE_INTEGER + "\"></div>");
  //console.log("pre script");
  //console.log(window.document.body.parentElement);

  var realHTML = window.document.documentElement;
  var fakeHTML = window.document.body.lastElementChild.lastElementChild;
  var realBody = window.document.body;
  var fakeBody = window.document.body.lastElementChild.lastElementChild.lastElementChild;


  var script = document.createElement('script');
  script.textContent = scriptText;
  (document.head||document.documentElement).appendChild(script);

  //$("body").prepend("<script>" + scriptText + "</script>");

  // push changes from html to fake html

  // ~~~ make sure things added later to the real body end up in
  // the fake body;
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.oldVal == "") {
        copyHTML($(fakeHTML));
      }
      //console.log(mutation);
    });
  });

  var config = {attributes: true, attributeOldValue: true};

  observer.observe(realHTML, config);

  // push changes from body to fake body


  // ~~~ make sure things added later to the real body end up in
  // the fake body;
  var observer2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.type == "attributes") {
        //console.log("change in attributes");
        //console.log(mutation);
      }
      if(mutation.type == "attributes" && mutation.oldVal == "") {
        copyBody($(fakeBody));
      }
      if(mutation.addedNodes && mutation.addedNodes[0]) {
        mutation.addedNodes.forEach(function(node) {
          fakeBody.appendChild(node);
        });
      }
    });
  });

  var config2 = {attributes: true, attributeOldValue: true, childList: true, subtree: false};

  observer2.observe(realBody, config2);

  // ~~~ end of fake body forcer



}


// We have to inject this script as soon as the body loads to make sure
// we properly overwrite various objects before any other scripts get to
// access them.

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.addedNodes && mutation.addedNodes[0] && mutation.addedNodes[0].tagName == "BODY") {
      console.log("body loaded");
      startRun();
      observer.disconnect();
    }
  });
});

// configuration of the observer:
var config = {childList: true, subtree: true };

// we need to make sure this is only run at the top frame or
// it gets added in every iframe and causes some crazy stack depth errors.
if (!inIframe()) {
  // pass in the target node, as well as the observer options
  observer.observe(document, config);
}

