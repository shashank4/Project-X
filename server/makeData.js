var React = require('react');
var Handlebars = require('handlebars');
//var miniData=require('../data/MiniData');

var fs = require("fs");
var admZip = require('adm-zip');
var xml2js = require('xml2js');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var parseString = require('xml2js').parseString;
var rename = require('rename');

var utils = require('../screen/store/utils');




var idmlFileName = "C:/Users/CS49/Desktop/IDML/Untitled-12.idml";



var targetPath="C:/Users/CS49/Desktop/IDML/try/"
var unZip = new admZip(idmlFileName);
unZip.extractAllTo(targetPath, /*overwrite*/true);

var dirPath = "C:/Users/CS49/Desktop/IDML/try/";                      //"C:/Users/CS49/Desktop/IDML/test1/";                    //'D:/DesktopData/IDML/newExamine_2/';
var uid = 0;

var parser = new xml2js.Parser();

var createXmlDom = function (xmlNode, doc) {
  var arrayOfNext = [], arrayOfPre = [];
  var tempNext = xmlNode;
  var tempPre = xmlNode;
  var zNext = 0, zPre = 0;

  //set id attribute.
  var uid = utils.generateUUID();
  xmlNode.setAttribute("data-uid", uid);

  while (tempNext.nextSibling != null) {
    arrayOfNext[zNext] = tempNext.nextSibling;
    tempNext = tempNext.nextSibling;
    zNext++;
  }

  while (tempPre.previousSibling != null) {
    arrayOfPre[zPre] = tempPre.previousSibling;
    tempPre = tempPre.previousSibling;
    zPre++;
  }


  var parentOfNode = xmlNode.parentNode;
  var newEl;

  newEl = doc.createElement("Custom");
  newEl.appendChild(xmlNode);

  var pre = zPre - 1;

  if (arrayOfPre.length > 0) {
    while (pre != 0) {
      parentOfNode.appendChild(arrayOfPre[pre]);
      pre--;
    }
  }

  parentOfNode.appendChild(newEl);

  var i = 0;
  if (arrayOfNext.length > 0) {
    while (i != zNext) {
      parentOfNode.appendChild(arrayOfNext[i]);
      i++;
    }
  }
};

var addCustomTag = function (doc) {

  var nodesContent = doc.getElementsByTagName("Content");
  for (var iter1 = 0; iter1 < nodesContent.length; iter1++) {
    createXmlDom(nodesContent[iter1], doc);
  }

  var nodesBr = doc.getElementsByTagName("Br");
  for (var iter2 = 0; iter2 < nodesBr.length; iter2++) {
    createXmlDom(nodesBr[iter2], doc);
  }

  var nodesXMLElement = doc.getElementsByTagName("XMLElement");
  for (var iter3 = 0; iter3 < nodesXMLElement.length; iter3++) {
    createXmlDom(nodesXMLElement[iter3], doc);
  }

  var nodesCharacterStyleRange = doc.getElementsByTagName("CharacterStyleRange");
  for (var iter4 = 0; iter4 < nodesCharacterStyleRange.length; iter4++) {
    createXmlDom(nodesCharacterStyleRange[iter4], doc);
  }

  var nodesParagraphStyleRange = doc.getElementsByTagName("ParagraphStyleRange");
  for (var iter5 = 0; iter5 < nodesParagraphStyleRange.length; iter5++) {
    createXmlDom(nodesParagraphStyleRange[iter5], doc);
  }
};

function writeClientData (oStoryData, spreadArray) {
  //Writing data into layout-data.handler
  var layoutHandlebar = fs.readFileSync(__dirname + '/../client/layout-data.handlebars').toString();
  var layoutTemplate = Handlebars.compile(layoutHandlebar);

  var layoutData = layoutTemplate({
    data: JSON.stringify(spreadArray)
  });

  fs.writeFileSync(__dirname + '/../data/layoutData.js', layoutData, null);


  //Writing data into story-data.handler
  var storyHandlebar = fs.readFileSync(__dirname + '/../client/story-data.handlebars').toString();
  var storyTemplate = Handlebars.compile(storyHandlebar);

  var storyData = storyTemplate({
    data: JSON.stringify(oStoryData)
  });

  fs.writeFileSync(__dirname + '/../data/storyData.js', storyData, null);
}

/*function removeCustomTag () {

 var builder = new xml2js.Builder();
 var xml = builder.buildObject((miniData.uee));
 var doc = new xmldom().parseFromString(xml.toString());


 var customNodes2= doc.getElementsByTagName("Custom");
 var len = customNodes2.length;
 for (var i = 0; i < len; i++) {
 var customNodes = doc.getElementsByTagName("Custom")[0];
 var childNode = xpath.select("//Custom*//*", customNodes);

 customNodes.parentNode.replaceChild(childNode[0], customNodes);
 //customNodes.parentNode.appendChild(childNode[0]);
 //customNodes.parentNode.removeChild(customNodes);
 }
 console.log(doc.toString());






 *//*  for(var i=0;i<customNodes.length;i++){
 var currentNode= doc.getElementsByTagName("Custom")[i];
 console.log("selected node is:  ");
 console.log(currentNode);

 console.log("parent node is:" );
 var parent=currentNode.parentNode;
 //var parentDom=new xmldom().parseFromString((currentNode.parentNode).toString());
 console.log();

 console.log("first child is:");
 var firstChild=currentNode.firstChild;
 var cloneOfFirstChild=firstChild.cloneNode(true);
 console.log(firstChild);
 //cloneOfFirstCh?ild=doc.createElement()
 //parent.removeChild(currentNode);
 var domOfClone=new xmldom().parseFromString(cloneOfFirstChild.toString());
 (parent).insertBefore(domOfClone,currentNode);

 //currentNode.parentNode
 console.log("parent node is:" );
 console.log("******************************************************\n"+parent);




 }


 }*/


var data = fs.readFileSync(dirPath + 'designmap.xml');

parser.parseString(data, function (err, result) {
  var result3 = result;

  var spreadArray = [];
  var spreadCount = result3.Document['idPkg:Spread'].length;
  var remaining = spreadCount;
  var sequenceMap = {};

  for (var i = 0; i < spreadCount; i++) {
    (function () {
      var spreadXMLName = result3.Document['idPkg:Spread'][i].$.src;

      var newData = fs.readFileSync(dirPath + spreadXMLName);

      parser.parseString(newData, function (err, resultSpread) {
        sequenceMap[spreadXMLName] = resultSpread;
        remaining -= 1;

        if (remaining == 0) {
          var oStoryData = {};
          for (var j = 0; j < spreadCount; j++) {
            spreadXMLName = result3.Document['idPkg:Spread'][j].$.src;
            spreadArray.push(sequenceMap[spreadXMLName]);

            if ((spreadArray[j]["idPkg:Spread"].Spread[0]).hasOwnProperty("TextFrame")) {
              var textFrameCount = spreadArray[j]["idPkg:Spread"].Spread[0].TextFrame.length;
              for (var tfIterator = 0; tfIterator < textFrameCount; tfIterator++) {

                var storyName = spreadArray[j]["idPkg:Spread"].Spread[0].TextFrame[tfIterator].$.ParentStory;
                var copyDataXml = fs.readFileSync(dirPath + 'Stories/Story_' + storyName + '.xml');
                var toString = copyDataXml.toString();

                var doc = new xmldom().parseFromString(toString);

                addCustomTag(doc);

                var jsonStory = "";
                parseString(doc, {async: false}, function (err, resultSpread) {
                  jsonStory = resultSpread;
                });

                oStoryData[storyName] = jsonStory;
              }
            }
          }
          writeClientData(oStoryData, spreadArray);
        }
      });

    })();
  }

});


/**
 * zip logic not working
 */
/*var tempPath="C:/Users/CS49/Desktop/IDML/Untitled-7/";
var zip= new admZip();
//zip.addLocalFolder(tempPath+"MasterSpreads");
//zip.addLocalFolder(tempPath+"META-INF");
//zip.addLocalFolder(tempPath+"Resources");
//zip.addLocalFolder(tempPath+"Spreads");
//zip.addLocalFolder(tempPath+"Stories");
zip.addLocalFolder(tempPath+"XML");
zip.addLocalFile(tempPath+"designmap.xml" );
//zip.addLocalFile(tempPath+"mimetype" );
zip.writeZip("C:/Users/CS49/Desktop/try.idml");*/

/*
 * Assumptions:
 *  Page Size does not vary in the same doc
 *
 * */


