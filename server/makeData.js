var React = require('react');
var Handlebars = require('handlebars');
//var miniData=require('../data/MiniData');
var _ = require('lodash');

var fs = require("fs");
var zip3 = require('adm-zip');
var xml2js = require('xml2js');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var parseString = require('xml2js').parseString;
var rename = require('rename');

var utils = require('../screen/store/utils');
var Config = require('./config');



var idmlFileName = Config.idmlPath;

var zip = new zip3(idmlFileName);
var dirPath = Config.extractedDirPath;                      //"C:/Users/CS49/Desktop/IDML/test1/";                    //'D:/DesktopData/IDML/newExamine_2/';

zip.extractAllTo(/*target path*/dirPath, /*overwrite*/true);
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
  //fs.writeFileSync('D:/DesktopData/storyData.js', JSON.stringify(oStoryData), null);
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

var stylesXML = fs.readFileSync(dirPath + 'Resources/' + 'Styles.xml');

parser.parseString(stylesXML, function (err, result) {

  var oCharacterStyle = [];
  var oParagraphStyle = [];
  var oStyles = result['idPkg:Styles'];
  var aCharacterStyleDOM = oStyles['RootCharacterStyleGroup'][0]['CharacterStyle'];
  _.forEach(aCharacterStyleDOM, function(oCharacterStyleProps, iIndex){
    oCharacterStyleProps = oCharacterStyleProps['$'];
    var sName = oCharacterStyleProps.Name;
    var sId = oCharacterStyleProps.Self;
    oCharacterStyle.push({
      id : sId,
      name : sName,
      isSelected : false
    });
    //oCharacterStyle[sId] = sName;
  });

  var aParagraphStyleDOM = oStyles['RootParagraphStyleGroup'][0]['ParagraphStyle'];
  _.forEach(aParagraphStyleDOM, function(oParagraphStyleProps , iIndex){
    oParagraphStyleProps = oParagraphStyleProps['$'];
    var sName = oParagraphStyleProps.Name;
    var sId = oParagraphStyleProps.Self;
    oParagraphStyle.push({
      id : sId,
      name : sName,
      isSelected : false
    });
    //oParagraphStyle[sId] = sName;
  });

  var stylesData = {
    "Character Styles" : oCharacterStyle,
    "Paragraph Styles" : oParagraphStyle
  };
  var styleHandlebar = fs.readFileSync(__dirname + '/../client/style-data.handlebars').toString();
  var styleDataTemplate = Handlebars.compile(styleHandlebar);
  var styleData = styleDataTemplate({
    data: JSON.stringify(stylesData)
  });
  fs.writeFileSync(__dirname + '/../data/styleData.js', styleData, null);

});

var metaXML = fs.readFileSync(dirPath + 'META-INF/' + 'metadata.xml');

parser.parseString(metaXML, function (err, result) {

  if(result['x:xmpmeta'] &&
      result['x:xmpmeta']['rdf:RDF'] &&
      result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'] &&
      result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['xmp:CSINDDMetaData']){

    var sStylesCSS = result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['xmp:CSINDDMetaData'][0];
    fs.writeFileSync(__dirname + '/../data/INDDStyles.css', sStylesCSS, null);
  }
  else {
    throw "Should be idml from InDesign CSDTP Extension"
  }


});


/*
 * Assumptions:
 *  Page Size does not vary in the same doc
 *
 * */


