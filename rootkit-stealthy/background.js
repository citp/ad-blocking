/* ----------------------------------------------------------------------------------
 * Author: Grant Storey;
 * Written: 12/26/16
 * Last Updated: 1/3/17
 * Description: Background page that sets up elements to hide;
 * Dependencies: easylist.txt
 * ----------------------------------------------------------------------------------
 */

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// given a list of strings, create a regex that matches those
function buildMatchRegex(list){
  var reList = [];
  for (index in list) {
    var currentItem = list[index];
    var myString = "(" + escapeRegExp(currentItem) + ")";
    reList.push(myString);
  }
  var reString = reList.join("|");
  //console.log("Regex String: " + reString);
  var myRe = new RegExp(reString, "gi");
  return myRe;
}

// List of site-specific rules
// each item has the following properties:
// matchRegex: a RegExp object that matches all sites that include this rule
// hasNoMatches: true if there are excepted sites for this rule
// noMatchRegex: a RegExp object that matches all sites excepted from this rule
// ruleText: a string containing the rule to add
var specificRulesList = [];

// List of site-specific exceptions
// matchRegex: a RegExp object that matches all sites that include this rule
// hasNoMatches: true if there are excepted sites for this rule
// noMatchRegex: a RegExp object that matches all sites excepted from this rule
// ruleText: a string containing the rule to add
var exceptionsList = [];


var allSitesSelector;

// parse easylist info
function parseEasylist(text) {
  var lines = text.split("\n");
  var numLines = 0;

  var allSitesList = []

  for (index in lines) {
    var line = lines[index];
    var lineIndex = index;
    //console.log(line);
    if (line[0] == "!") {
      // comment
    } else if ((line.indexOf("##") >= 0) || (line.indexOf("#@#") >= 0)) {
      var sitesString;
      var rulesString;
      var split;
      var exception;

      numLines++;

      if (line.indexOf("#@#") >= 0) {
        // exception rule
        split = line.split("#@#");
        exception = true;
      } else {
        // regular rule
        split = line.split("##");
        exception = false;
      }
      sitesString = split[0];
      rulesString = split[1];

      if (!exception && sitesString == "") {
        allSitesList.push(rulesString);
        continue;
      }

      sites = sitesString.split(",");

      var yesSites = [];
      var noSites = [];
      for (var index2 in sites) {
        var site = sites[index2];
        if (site[0] == "~") {
          noSites.push(site.substring(1));
        } else {
          yesSites.push(site);
        }
      }
      var obj = {};
      obj["ruleText"] = rulesString;
      obj["matchRegex"] = buildMatchRegex(yesSites);
      if (noSites.length > 0) {
        obj["hasNoMatches"] = true;
        obj["noMatchRegex"] = buildMatchRegex(noSites);
      } else {
        obj["hasNoMatches"] = false;
        obj["noMatchRegex"] = null;
      }

      if (exception) {
        exceptionsList.push(obj);
      } else {
        specificRulesList.push(obj);
      }

      if (lineIndex % 1000 == 806 && false) {
        console.log("Str: " + line);
        console.log("Sites: " + sites.join(" ; "));
        console.log("Rules: " + rulesString);
        console.log("Exception: " + exception);
        console.log("--------------------------------------");
        console.log(obj);
        var urlStrs = [
          "google.com",
          "mail.google.com",
          "google.com/hahaha",
          "https://mail.bah.google.com",
          "https://mail.google.com"
        ];
        for (var i in urlStrs) {
          var urlStr = urlStrs[i];
          console.log("test on \"" + urlStr + "\": " + urlMatchesRule(obj, urlStr));
        }
        console.log("=========================================");
      }

    }
  }
  allSitesSelector = allSitesList.join(", ");
  /*
  console.log("# lines: " + lines.length);
  console.log("# lines: " + numLines);
  */
}

// return true if the given rule applies to the urlString
function urlMatchesRule(rule, urlString) {
  var matchesYes = rule["matchRegex"].test(urlString);
  var matchesException = rule["hasNoMatches"] && rule["noMatchRegex"].test(urlString);
  // need to reset lastIndex or the regexes break
  //https://siderite.blogspot.com/2011/11/careful-when-reusing-javascript-regexp.html#at3060321440
  rule["matchRegex"].lastIndex = 0;
  if(rule["hasNoMatches"]) {
    rule["noMatchRegex"].lastIndex = 0;
  }
  return (matchesYes && !matchesException);
}

// grab the selectors and exceptions for the given site url
function getSiteSelectors(siteURL) {
  var selectors = [];
  var exceptions = [];

  // List of site-specific exceptions
  // matchRegex: a RegExp object that matches all sites that include this rule
  // hasNoMatches: true if there are excepted sites for this rule
  // noMatchRegex: a RegExp object that matches all sites excepted from this rule
  // ruleText: a string containing the rule to add
  for (index in specificRulesList) {
    var rule = specificRulesList[index];
    if (urlMatchesRule(rule, siteURL)) {
      selectors.push(rule["ruleText"]);
    }
  }

  for (index in exceptionsList) {
    var rule = exceptionsList[index];
    if (urlMatchesRule(rule, siteURL)) {
      exceptions.push(rule["ruleText"]);
    }
  }

  //var exceptionsList = [];

  var selectorsString = allSitesSelector;
  if (selectors.length > 0) {
    selectorsString += ", " + selectors.join(", ");
  }
  var exceptionsString = "";
  if (exceptions.length > 0) {
    exceptionsString += exceptions.join(", ");
  }
  return {selectors: selectorsString, exceptions: exceptionsString};
}

// load easylist data;
// http://stackoverflow.com/questions/13832251/how-to-read-and-display-file-in-a-chrome-extension
var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('easylist.txt'), true);
xhr.onreadystatechange = function()
{
  if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
  {
    parseEasylist(xhr.responseText);
  }
};
xhr.send();

// handle messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "selectors"){
      var res = getSiteSelectors(sender.url);
      sendResponse(res);
    }
  });
