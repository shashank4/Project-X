var React = require('react');
var Handlebars = require('handlebars');

var fs = require("fs");
var zip3 = require('adm-zip');
var xml2js = require('xml2js');
var util = require('util');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var parseString = require('xml2js').parseString;

//var storyStore = require('./../screen/store/storyStore.js');
var dirPath = 'D:/DesktopData/IDML/newExamine_2/';

var zip = new zip3('D:/DesktopData/IDML/testing1.zip');
zip.extractAllTo(/*target path*/"D:/DesktopData/IDML/", /*overwrite*/true);

var parser = new xml2js.Parser();
var doc2;
var inc = 0;

var createXmlDom=function(xmlNode,doc){
    var arrayOfNext = [], arrayOfPre = [];
    var tempNext = xmlNode;
    var tempPre = xmlNode;
    var zNext = 0, zPre = 0;
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
        createXmlDom(nodesBr[iter2],doc);
    }


    var nodesXMLElement = doc.getElementsByTagName("XMLElement");
    for (var iter3 = 0; iter3 < nodesXMLElement.length; iter3++) {
        createXmlDom(nodesXMLElement[iter3], doc);
    }

    var nodesCharacterStyleRange = doc.getElementsByTagName("CharacterStyleRange");
    for (var iter4 = 0; iter4 < nodesCharacterStyleRange.length; iter4++) {
        createXmlDom(nodesCharacterStyleRange[iter4],doc);
    }

    var nodesParagraphStyleRange = doc.getElementsByTagName("ParagraphStyleRange");
    for (var iter5 = 0; iter5 < nodesParagraphStyleRange.length; iter5++) {
        createXmlDom(nodesParagraphStyleRange[iter5], doc);
    }
};


fs.readFile(dirPath + 'designmap.xml', function (err, data) {

    parser.parseString(data, function (err, result) {
        result3 = result;

        var spreadArray = [];
        var spreadCount = result3.Document['idPkg:Spread'].length;
        var remaining = spreadCount;
        var sequenceMap = {};

        for (var i = 0; i < spreadCount; i++) {
            (function () {
                var spreadXMLName = result3.Document['idPkg:Spread'][i].$.src;


                fs.readFile(dirPath + spreadXMLName, function (err, data) {

                    parser.parseString(data, function (err, resultSpread) {
                        //spreadArray.push(resultSpread);  //JSON.stringify(resultSpread)

                        sequenceMap[spreadXMLName] = resultSpread;
                        remaining -= 1;

                        if (remaining == 0) {
                            var oStoryData = {};
                            for (var j = 0; j < spreadCount; j++) {
                                spreadXMLName = result3.Document['idPkg:Spread'][j].$.src;
                                //console.log(spreadXMLName );
                                spreadArray.push(sequenceMap[spreadXMLName]);
                                console.log("ganpati bappa moraya////////" + spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame.length);


                                if ((spreadArray[j]["idPkg:Spread"].Spread[0]).hasOwnProperty("TextFrame")) {
                                    var textFrameCount = spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame.length;
                                    for (var tfIterator = 0; tfIterator < textFrameCount; tfIterator++) {

                                        var storyName = spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame[tfIterator].$.ParentStory;
                                        var copyDataXml= fs.readFileSync(dirPath + 'Stories/Story_' + storyName + '.xml');
                                        var toString = copyDataXml.toString();

                                        var doc = new xmldom().parseFromString(toString);
                                        doc2 = doc;

                                        /*var seqNo = 0;
                                        var nodes = xpath.select("//Content | //Br", doc);
                                        for (var i = 0; i < nodes.length; i++) {
                                            var charStyleName = storyStore.getCharaStyleName(nodes[i]);
                                            var paraStyleName = storyStore.getParaStyleName(nodes[i]);
                                            var xmlTagArray = storyStore.getXmlTag(nodes[i]);

                                            nodes[i].setAttribute("ParagraphStyleName", paraStyleName);
                                            nodes[i].setAttribute("CharacterStyleName", charStyleName);
                                            nodes[i].setAttribute("TagSelf", xmlTagArray[0]);
                                            nodes[i].setAttribute("TagName", xmlTagArray[1]);
                                            nodes[i].setAttribute("contenteditable", true);
                                            nodes[i].setAttribute("seqNo", seqNo++);
                                        }
*/
                                        addCustomTag(doc);
                                        //console.log("jdhfgjshdfgjshdgfjhgdfjshfg--------------------" + doc.toString());


                                        var jsonStory = "";

                                        parseString(doc, {async: false}, function (err, resultSpread) {
                                            console.log("hellooooooooo");
                                            jsonStory = resultSpread;
                                        });

                                        console.log(JSON.stringify(jsonStory));
                                        oStoryData[storyName] = jsonStory;
                                    }
                                }
                            }

                            writeClientData(oStoryData, spreadArray);

                        }
                    });

                });
            })();
        }

    });
});


/*
 * Assumptions:
 *  Page Size does not vary in the same doc
 *
 * */


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