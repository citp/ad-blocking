/* ----------------------------------------------------------------------------------
 * Authors: Grant Storey & Dillon Reisman
 * Written: 12/28/16
 * Last Updated: 3/5/17
 * Description: This provides helper functions for image searching using
 * fuzzy hashing.
 * Dependencies: jquery, perceptual_background.js
 * ----------------------------------------------------------------------------------
 */

// this function hardcodes the styles of oldElement onto newElement;
function hardcodeStyles(oldElement, newElement) {
  var computedStyle = window.getComputedStyle(oldElement, null);
  for (prop in computedStyle) {
    newElement.style[prop] = computedStyle[prop];
  }
}

// recursively apply the map function to the children
// of oldElement and its clone newElement
function recursiveMap(oldElement, newElement, mapFunction) {
  mapFunction(oldElement, newElement);
  for (var i = 0; i < oldElement.children.length; i++) {
    var oldChild = oldElement.children[i];
    var newChild = newElement.children[i];
    recursiveMap(oldChild, newChild, mapFunction)
  }
}

// create and return a deep copy of element with
// mapFunction (taking the old element and new element)
// applied to each child element.
function deepMap(element, mapFunction) {
  var newEl = element.cloneNode(true);
  recursiveMap(element, newEl, mapFunction);
  return newEl;
}

// given an svg, determine the bounding box that contains all pixels with
// alpha above alphaThreshold. This allows cropping of images with large
// transparency margins.
var contextBoundingBox = function(ctx,alphaThreshold){
    if (alphaThreshold===undefined) alphaThreshold = 15;
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    var w=ctx.canvas.width,h=ctx.canvas.height;
    var data = ctx.getImageData(0,0,w,h).data;
    for (var x=0;x<w;++x){
      for (var y=0;y<h;++y){
        var a = data[(w*y+x)*4+3];
        if (a>alphaThreshold){
          if (x>maxX) maxX=x;
          if (x<minX) minX=x;
          if (y>maxY) maxY=y;
          if (y<minY) minY=y;
        }
      }
    }
    return {x:minX,y:minY,maxX:maxX,maxY:maxY,w:maxX-minX,h:maxY-minY};
}

// given an img and crop dimensions, crop the image and get the dataURL
// associated with it.
//http://stackoverflow.com/questions/34242155/how-to-crop-canvas-todataurl
function cropPlusExport(img,cropX,cropY,cropWidth,cropHeight){
  // create a temporary canvas sized to the cropped size
  var canvas1=document.createElement('canvas');
  var ctx1=canvas1.getContext('2d');
  canvas1.width=cropWidth;
  canvas1.height=cropHeight;
  // use the extended from of drawImage to draw the
  // cropped area to the temp canvas
  ctx1.drawImage(img,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
  // return the .toDataURL of the temp canvas
  return(canvas1.toDataURL());
}

// run an image search on all images (in the src of img tags, in the background
// of divs, links, and spans, and in svgs) found in container, and if any
// matches are found run the result function.
function runImageSearch(container, resultFunction) {
  // Case 1: adchoices icon is image
  container.find('img').each(function( index, element) {
      src_url = $(element)[0].src;
      if ($(element)[0].width > 1 || $(element)[0].height > 1) {
        if (src_url) {
            chrome.runtime.sendMessage({data: [src_url,$(element).prop('outerHTML')]},
                                       resultFunction);
        }
      }
  });

  // Case 2: adchoices icon is a div background
  // may need to add more elements to this list as advertisers get
  // adversarial.
  container.find('div,a,span').each(function(index, element) {
      var bg = $(element).css('background-image');
      bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");

      if (bg && bg !== 'none') {
          chrome.runtime.sendMessage({data: [bg, $(element).prop('outerHTML')]},
                                     resultFunction);
      }
  });

  // Case 3; adchoices icon is an <svg> element
  container.find('svg').each(function(index, element) {

      // if for some reason the exact styles are needed, use
      // this (el_2) instead of "element" below.
      // example use case would be if an advertiser drew a large square
      // over the adchoices icon but then hid the square using a stylesheet
      // in another part of the code; in the current configuration this
      // style would not be carried over to the background script's
      // analysis, but by using deepMap they would.
      //var el_2 = deepMap(element, hardcodeStyles);

      var svg_html = $(element).prop('outerHTML');


      // Wrap svg in new <svg><foreignObject> element
      var wrapper_open = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="200">' +
                         '<foreignObject width="100%" height="100%">';
      var wrapper_close = '</foreignObject></svg>';
      var data_string = wrapper_open + svg_html + wrapper_close;

      var img = new Image();
      img.crossOrigin="CITPymous";

      var url = 'data:image/svg+xml;charset=utf8, ' + encodeURIComponent(data_string);


      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var margin = 2;
      img.onload = function () {
          ctx.drawImage(img,0,0);
          var crop = contextBoundingBox(ctx)
          var dataURL = cropPlusExport(img, crop.x-margin, crop.y-margin, crop.w+(2*margin), crop.h+(2*margin));
          chrome.runtime.sendMessage({data: [dataURL, svg_html]},
                                     resultFunction);

      }
      img.src = url;
  });
}
