/**
 * Created by CS49 on 22-09-2015.
 */
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var xml2js=require('xml2js');
var parseString = require('xml2js').parseString;

var utils = (function () {

  return {
    getPageDimension: function (obj, p) {
      var geometricBoundsString = obj['idPkg:Spread'].Spread[0].Page[p].$.GeometricBounds;
      var geometricBoundsArray = geometricBoundsString.split(" ");
      var oPageDim = {};

      oPageDim['topLeftX'] = parseInt(geometricBoundsArray[0]);
      oPageDim['topLeftY'] = parseInt(geometricBoundsArray[1]);
      oPageDim['rightBottomX'] = parseInt(geometricBoundsArray[3]);
      oPageDim['rightBottomY'] = parseInt(geometricBoundsArray[2]);
      oPageDim['height'] = parseInt(geometricBoundsArray[2]);
      oPageDim['width'] = parseInt(geometricBoundsArray[3]);
      return oPageDim;
    },

    getBindingLocation: function (s) {
      return parseInt(aJson[s]['idPkg:Spread'].Spread[0].$.BindingLocation);
    },

    getHalfPageHeight: function (obj) {
      //console.log("getHalfPageHeight");
      var abc = (obj.Page[0].$.GeometricBounds).split(" ");
      var xyz = parseInt(abc[2]) / 2;
      //console.log("halfPage Height:"+xyz);
      return xyz;
    },

    getSpreadDimension: function (s) {
      var pageCount = parseInt(aJson[s]['idPkg:Spread'].Spread[0].$.PageCount);
      var totPageWidth = 0;
      var maxPageHeight = 0;
      var leftMargin;
      for (var p = 0; p < pageCount; p++) {
        var oPageDim = this.getPageDimension(s, p);
        totPageWidth = totPageWidth + oPageDim.width;
        if (oPageDim.height > maxPageHeight) {
          maxPageHeight = oPageDim.height;
        }

      }
      var BL = this.getBindingLocation(s);
      if (BL == 0) {
        leftMargin = 1224;
      }
      else if (BL == 1) {
        leftMargin = 612;
      }


    },

    getXmlDom: function (filePath) {
      console.log("File path is:" + filePath);
      var selectedNodes = 0;
      fs.readFile(filePath, function (err, fileData1) {
        var toString = fileData1.toString();
        var doc = new xmldom().parseFromString(toString);

        var contentNodes = xpath.select("//Content", doc);
        for (var i = 0; i < contentNodes.length; i++) {
          contentNodes[i].setAttribute("selectNode", "kTrue");
        }

        var brNodes = xpath.select("//Br", doc);
        for (var i = 0; i < brNodes.length; i++) {
          brNodes[i].setAttribute("selectNode", "kTrue");
        }

        //console.log("++++++++++++++++++++++++++++++++++++"+doc);
        /*selectedNodes = xpath.select("/*/
        /*[contains(@selectNode, 'kTrue')]",doc);
         console.log("/////////////////////"+selectedNodes.length);
         var nodeMapping2=1000;
         for(var j=0;j<selectedNodes.length;j++){
         selectedNodes[i].setAttribute("nodeMapping",nodeMapping2++);
         console.log("node: " + selectedNodes[j].toString());
         }*/

        return selectedNodes;
      });
    },

    getCharaStyleName2: function (tempStr1) {

      console.log(tempStr1);
      var IDIndex = tempStr1.search('CharacterStyle/');
      var reqIndex = IDIndex + 15;
      var startIndex = reqIndex;

      if (tempStr1.search('"') != -1) {
        while (tempStr1.charAt(reqIndex) != '"') {
          reqIndex++;
        }
      }
      else {
        reqIndex = tempStr1.length;
      }

      var styleName = tempStr1.substring(startIndex, reqIndex);

      if (styleName.search('No character style') != (-1)) {
        styleName = "";
      }
      else {
        do {
          styleName = styleName.replace(" ", "-");
        } while (styleName.search(" ") != (-1));
      }
      //console.log("character styleName is:"+styleName);

      return styleName;

    },

    getParaStyleName2: function (tempStr1) {
      var IDIndex = tempStr1.search('ParagraphStyle/');
      var reqIndex = IDIndex + 15;
      var startIndex = reqIndex;

      if (tempStr1.search('"') != -1) {
        while (tempStr1.charAt(reqIndex) != '"') {
          reqIndex++;
        }
      }
      else {
        reqIndex = tempStr1.length;
      }
      var styleName = tempStr1.substring(startIndex, reqIndex);

      if (styleName.search('NormalParagraphStyle') != (-1)) {
        styleName = "Basic-Paragraph";
      }
      else {
        do {
          styleName = styleName.replace(" ", "-");
        } while (styleName.search(" ") != (-1));
      }
      //console.log("styleName is:" + styleName);

      return styleName;
    },

    getXmlTag2: function (XMLElement) {
      var tempStr1 = XMLElement.toString();
      if (tempStr1.search('XMLElement') != (-1)) {
        var IDIndex = tempStr1.search('Self=');
        var reqIndex = IDIndex + 6;
        var startIndex = reqIndex;
        while (tempStr1.charAt(reqIndex) != '"') {
          reqIndex++;
        }
        var tagSelf = tempStr1.substring(startIndex, reqIndex);

        var IDIndex2 = tempStr1.search('XMLTag/');
        var reqIndex2 = IDIndex2 + 7;
        var startIndex2 = reqIndex2;
        while (tempStr1.charAt(reqIndex2) != '"') {
          reqIndex2++;
        }
        var tagName = tempStr1.substring(startIndex2, reqIndex2);
        var aReturn = [];
        aReturn[0] = tagSelf;
        aReturn[1] = tagName;
      }
      return aReturn;
    },


    getAllStoryData: function(obj){
      console.log("in the util----------------------------"+obj.uee);
      var xmlString=this.removeCustomTag(obj.uee);
      console.log("hello you are a pro man:"+xmlString);

      /*var keyValues=Object.keys(obj);
      console.log("in the util------before for loop----------------------"+keyValues.length);*/

        /*for(var i=0;i<keyValues.length;i++){
          //console.log("in the util------before for loop----------------------"+obj.keyValues[i]);
          //var singleStory=obj.(keyValues[i]);
          console.log("in the util------in the for loop----------------------"+keyValues[i]);
          var storyName=keyValues[i];
          console.log(obj.storyName);
          //var xmlString=this.removeCustomTag(singleStory);
          //console.log("in the util------before for loop----------------------");
          //console.log("hello you are a pro man:"+xmlString);
        }*/
    },


    removeCustomTag: function(jsonData){
      console.log("in the remocve tag");

      var builder = new xml2js.Builder();
      var xml = builder.buildObject((jsonData));
      var doc = new xmldom().parseFromString(xml.toString());


      var customNodes2= doc.getElementsByTagName("Custom");
      var len = customNodes2.length;
      for (var i = 0; i < len; i++) {
        var customNodes = doc.getElementsByTagName("Custom")[0];
        var childNode = xpath.select("//Custom/*", customNodes);
        customNodes.parentNode.replaceChild(childNode[0], customNodes);
        //customNodes.parentNode.appendChild(childNode[0]);
        //customNodes.parentNode.removeChild(customNodes);
      }
      //console.log(doc.toString());
      return doc.toString();

    }



    /*  getCharaStyleName: function (node) {
     var CharacterStyleRange = xpath.select("..", node);

     var thisParent = "/..";
     var temp2 = (CharacterStyleRange.toString());
     while (temp2.search('CharacterStyleRange') == (-1)) {
     CharacterStyleRange = xpath.select(".." + thisParent, node);
     thisParent = thisParent + thisParent;
     temp2 = (CharacterStyleRange.toString());
     }

     var tempStr1 = CharacterStyleRange.toString();
     var styleName;
     if (tempStr1.search('CharacterStyleRange') != (-1)) {
     styleName = this.getCharaStyleName2(tempStr1);
     }
     return styleName;

     },

     getParaStyleName: function (node) {

     var ParagraphStyleRange = xpath.select("..", node);
     var thisParent = "/..";
     var temp2 = (ParagraphStyleRange.toString());
     while (temp2.search('ParagraphStyleRange') == (-1)) {
     ParagraphStyleRange = xpath.select(".." + thisParent, node);
     thisParent = thisParent + thisParent;
     temp2 = (ParagraphStyleRange.toString());
     }
     var tempStr1 = ParagraphStyleRange.toString();
     var styleName;
     if (tempStr1.search('ParagraphStyleRange') != (-1)) {
     styleName = this.getParaStyleName2(tempStr1);
     }
     return styleName;

     },

     getXmlTag: function (node) {
     var XMLElement = xpath.select("..", node);

     var thisParent = "/..";
     var temp2 = (XMLElement.toString());
     while (temp2.search('XMLElement') == (-1)) {
     XMLElement = xpath.select(".." + thisParent, node);
     thisParent = thisParent + thisParent;
     temp2 = (XMLElement.toString());
     }

     return this.getXmlTag2(XMLElement);
     },
     */
  }


})();

module.exports = utils;
