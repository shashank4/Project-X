require("node-jsx").install({extension: ".js"});   //jsxt
var React = require('react');

var fs = require("fs");
var zip3 = require('adm-zip');
var xml2js = require('xml2js');
var util = require('util');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var parseString = require('xml2js').parseString;


var AppController = require('../js/controller/AppController.jsx');
var layoutStore = require('../js/store/layoutStore.js');
var storyStore = require('../js/store/storyStore.js');

var dirPath = 'D:/DesktopData/IDML/newExamine_2/';


var zip = new zip3('D:/DesktopData/IDML/testing1.zip');
zip.extractAllTo(/*target path*/"D:/DesktopData/IDML/", /*overwrite*/true);

var parser = new xml2js.Parser();
//var str = "";
var storyFlag = 0;

var getChild = '/*';
var doc2;
var inc = 0;


/*var addCustomTag=function(parent){

 var parentDom = new xmldom().parseFromString(parent.toString());
 var child=xpath.select("*/
 /*"+getChild,doc2);
 getChild=getChild+getChild;
 console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+child.length);
 var posSeq=0;   //starts from 0.
 for(var nodeLen=0;nodeLen<child.length;nodeLen++){
 child[nodeLen].setAttribute("PosSeq", posSeq++);
 }
 for(var nodeLen=0;nodeLen<child.length;nodeLen++){
 addCustomTag(child[nodeLen]);
 }

 console.log("jdhfgjshdfgjshdgfjhgdfjshfg--------------------"+parentDom.toString());
 //return parent;
 };*/     /*var contentCount = 100;
 var brCount = 100;
 var xmlElementCount=100;
 var caraCount=100;
 var paraCount=100;*/

var createXmlDom = function (xmlNode, doc) {
    //console.log("111111111111111111111111111" + xmlNode.tagName);
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
    //console.log("parent is:" + parentOfNode.toString());
    var newEl;

    newEl = doc.createElement("Custom" /*+ caraCount++*/);
    /*if(xmlNode.tagName=="Content") {
     newEl = doc.createElement("Content" + contentCount++);
     }else if(xmlNode.tagName=="Br"){
     newEl = doc.createElement("Br" + brCount++);
     }else if(xmlNode.tagName=="XMLElement"){
     newEl = doc.createElement("XMLElement" + xmlElementCount++);
     }else if(xmlNode.tagName=="CharacterStyleRange"){
     newEl = doc.createElement("Custom" */
    /*+ caraCount++*/
    /*);
     }else if(xmlNode.tagName=="ParagraphStyleRange"){
     newEl = doc.createElement("ParagraphStyleRange" + paraCount++);
     }*/


    newEl.appendChild(xmlNode);

    var pre = zPre - 1;

    if (arrayOfPre.length > 0) {
        while (pre != 0) {
            parentOfNode.appendChild(arrayOfPre[pre]);
            pre--;
        }
    }

    parentOfNode.appendChild(newEl/*,nodesContent[iter]*/);

    var i = 0;
    if (arrayOfNext.length > 0) {
        while (i != zNext) {
            parentOfNode.appendChild(arrayOfNext[i]);
            i++;
        }
    }

    console.log("batli ghyaychi ka?22222222222");
};


var addCustomTag = function (doc) {

    console.log("batli ghyaychi ka?");

    /*

     //var parentDom = new xmldom().parseFromString(parent.toString());
     */
    /*var child = xpath.select( getChild, doc);

     //var nodeName = xpath.select( getChild+'/name()', doc);
     getChild = getChild + '*/
    /*
     */
    /*';
     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" + child.length);
     var posSeq = 0;   //starts from 0.
     for (var nodeLen = 0; nodeLen < child.length; nodeLen++) {
     child[nodeLen].setAttribute("PosSeq", posSeq++);
     var parentOfChild=xpath.select('..',child[nodeLen]);
     //console.log("parentOfChild33333"+parentOfChild.toString());

     var newEl=doc.createElement("Wrapper"+wrCount++);

     var oldChild=xpath.select(getChild + '*/
    /*
     */
    /*',child[nodeLen]);
     console.log("oldChild"+oldChild.toString());
     newEl.appendChild(oldChild);
     console.log("first append");
     console.log("newEl"+newEl.toString());
     parentOfChild.appendChild(newEl);
     console.log("last append");*/
    /*



     */
    /*var nodeName=child[nodeLen].tagName;
     var newNode=renameNode(nodeName,null,"hiii");
     console.log("yeahahahah"+newNode);*/
    /*

     //child[nodeLen].outerHTML =child[nodeLen].outerHTML.replace(/nodeName/g,"hii");
     //////////////////////////////////////////////////
     */
    /*var oldNode =  child[nodeLen],
     newNode = React.createElement('nodeName'+inc),
     node,
     nextNode;

     node = oldNode.firstChild;
     while (node) {
     nextNode = node.nextSibling;
     newNode.appendChild(node);
     node = nextNode;
     }

     newNode.className = oldNode.className;
     // Do attributes too if you need to
     newNode.id = oldNode.id; // (Not invalid, they're not both in the tree at the same time)
     oldNode.parentNode.replaceChild(newNode, oldNode);*/
    /*

     ////////////////////////////////////////
     */
    /*var myAnchor = child[nodeLen];
     var mySpan = doc.createElement("span"+inc);
     mySpan.innerHTML = "replaced anchor!";
     myAnchor.replaceChild(mySpan, myAnchor);*/
    /*


     //var nodesContent = xpath.select("//Content", doc);

     */

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

    /*var nodesStory = doc.getElementsByTagName("Story");
     for (var iter6 = 0; iter6 < nodesStory.length; iter6++) {
     createXmlDom(nodesStory[iter6],doc);
     }*/

};


fs.readFile(dirPath + 'designmap.xml', function (err, data) {

    parser.parseString(data, function (err, result) {
        result3 = result;

        var spreadArray = [];
        var spreadCount = result3.Document['idPkg:Spread'].length;
        var remaining = spreadCount;
        var sequenceMap = {};

        ///*************************************************************************
        var parser2 = new xml2js.Parser();
        //storyStore.setDirPath('C:/Users/CS49/Desktop/test11/Stories/');
        var storyName = 'ued';
        //fs.readFile(dirPath + 'Stories/Story_' + storyName + '.xml', function (err, originalData) {
        /*var fileData1 = originalData;
         var toString = fileData1.toString();

         var doc = new xmldom().parseFromString(toString);
         var seqNo = 0;
         var nodes = xpath.select("//Content | //Br", doc);
         for (var i = 0; i < nodes.length; i++) {
         var charStyleName = storyStore.getCharaStyleName(nodes[i]);
         var paraStyleName = storyStore.getParaStyleName(nodes[i]);
         var xmlTagArray = storyStore.getXmlTag(nodes[i]);

         nodes[i].setAttribute("ParagraphStyleName", paraStyleName);
         nodes[i].setAttribute("CharacterStyleName", charStyleName);
         nodes[i].setAttribute("TagSelf", xmlTagArray[0]);
         nodes[i].setAttribute("TagName", xmlTagArray[1]);
         nodes[i].setAttribute("contentEditable", true);
         nodes[i].setAttribute("seqNo", seqNo++);
         }


         parseString(doc, {async: true}, function (err, resultSpread) {
         console.log("hellooooooooo");
         //console.log(JSON.stringify(resultSpread));
         });


         var aXmlDom = nodes.join("");
         //console.log("hiiiiiii"+aXmlDom);
         //storyStore.setStoreData(aXmlDom);

         var data = doc.toString();
         //console.log("data.length is::::*****"+data.length);
         var str = "";
         for (var i = 0; i < data.length; i++) {

         if (data.substring(i, i + 3) == '<Br') {

         var arrayContentBR = [];
         while (data.substring(i - 2, i) != "/>") {
         arrayContentBR.push(data.charAt(i));
         i++;
         }
         var tempStrBR = arrayContentBR.join("");
         str = str.concat(tempStrBR);
         str = str + "\n";
         }

         if (data.substring(i, i + 8) == '<Content') {
         var arrayContent = [];
         while (data.substring(i - 10, i) != "</Content>") {
         arrayContent.push(data.charAt(i));
         i++;
         }
         var tempStr = arrayContent.join("");
         tempStr = tempStr.replace("Content", "span");
         //tempStr = tempStr.replace("</Content>", "</span>");
         str = str.concat(tempStr);
         str = str + "\n";
         //mapping++;
         }
         }
         //console.log("what to DO NOW....I "+spreadArray);
         //
         //console.log("first:" + str);
         //storyStore.setStoreData(str);

         */
        /*parser2.parseString(data, function (err, resultStory) {
         console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
         console.log("story json is:"+JSON.stringify( resultStory));
         var span=React.createElement('span');
         storyFlag=1;
         });*/
        /*
         /*/
        /**************************************************************************

         */
        for (var i = 0; i < spreadCount; i++) {
            (function () {
                var spreadXMLName = result3.Document['idPkg:Spread'][i].$.src;


                fs.readFile(dirPath + spreadXMLName, function (err, data) {

                    parser.parseString(data, function (err, resultSpread) {
                        //spreadArray.push(resultSpread);  //JSON.stringify(resultSpread)

                        sequenceMap[spreadXMLName] = resultSpread;
                        remaining -= 1;
                        var oStoryData = {};
                        if (remaining == 0) {

                            for (var j = 0; j < spreadCount; j++) {
                                spreadXMLName = result3.Document['idPkg:Spread'][j].$.src;
                                //console.log(spreadXMLName );
                                spreadArray.push(sequenceMap[spreadXMLName]);
                                console.log("ganpati bappa moraya////////" + spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame.length);


                                if ((spreadArray[j]["idPkg:Spread"].Spread[0]).hasOwnProperty("TextFrame")) {
                                    var textFrameCount = spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame.length;
                                    for (var tfIterator = 0; tfIterator < textFrameCount; tfIterator++) {

                                        var storyName = spreadArray[0]["idPkg:Spread"].Spread[0].TextFrame[tfIterator].$.ParentStory;
                                        //console.log(storyName);
                                        var storyDataXmlOriginal = fs.readFileSync(dirPath + 'Stories/Story_' + storyName + '.xml');
                                        var copyDataXml = storyDataXmlOriginal;

                                        var toString = copyDataXml.toString();

                                        var doc = new xmldom().parseFromString(toString);
                                        doc2 = doc;

                                        var seqNo = 0;
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


                                        //var root = xpath.select("/", doc);
                                        //console.log("11111111111111111111111111111111111111"+root);
                                        //var xmlDoc=loadXMLDoc(dirPath + 'Stories/Story_' + storyName + '.xml');
                                        // /*var parentDom =*/
                                        addCustomTag(doc);


                                        console.log("jdhfgjshdfgjshdgfjhgdfjshfg--------------------" + doc.toString());


                                        var jsonStory = "";

                                        parseString(doc, {async: false}, function (err, resultSpread) {
                                            console.log("hellooooooooo");
                                            jsonStory = resultSpread;
                                        });

                                        console.log(JSON.stringify(jsonStory));
                                        oStoryData[storyName] = jsonStory;
                                        //storyArray.push(oStoryData);
                                    }
                                }
                            }


                            //console.log("spreadArray is" + JSON.stringify(spreadArray));
                            storyStore.setStoreData(oStoryData);
                            layoutStore.setStoreData(spreadArray);


                            /*for(var q=0;q<spreadArray.length;q++){
                             (function(){
                             console.log("SpreadArrayLength:=="+spreadArray.length);
                             if((spreadArray[q]['idPkg:Spread'].Spread[0]).hasOwnProperty("TextFrame")){
                             console.log("Has A textFrame...");
                             var oStoryContent={};
                             for(var txt=0;txt<(spreadArray[q]['idPkg:Spread'].Spread[0].TextFrame.length);txt++){
                             (function(){
                             var storyName=spreadArray[q]['idPkg:Spread'].Spread[0].TextFrame[txt].$.ParentStory;
                             console.log("No. of textFrames are:"+(spreadArray[q]['idPkg:Spread'].Spread[0].TextFrame.length));
                             console.log("file path with name:==="+(dirPath+'Story_'+storyName+'.xml'));
                             //////////////////////////////////////////////////////////////////////////////////////
                             fs.readFile(dirPath+'Stories/Story_'+storyName+'.xml'*/
                            /*'C:/Users/CS49/Desktop/test11/Stories/Story_ud9.xml'*/
                            /*, function (err, fileData1) {
                             //console.log(fileData1.toString());
                             //var mapping = 100;
                             //console.log(fileData1);

                             var toString=fileData1.toString();

                             var doc = new xmldom().parseFromString(toString);
                             console.log('Doc is:----'+doc);
                             var nodes = xpath.select("//Content", doc);
                             var nodeMapping2=1000;
                             console.log("node is=== "+nodes.length);

                             for(var iOuter=0;iOuter<nodes.length;iOuter++) {
                             nodes[iOuter].setAttribute("nodeMapping",nodeMapping2++);
                             console.log("node: " + nodes[iOuter].toString());
                             }

                             var data = fileData1.toString();
                             for (var iInner = 0; iInner < data.length; iInner++) {

                             if (data.substring(iInner, iInner + 6) == '<Br />') {
                             var brStr = (data.substring(iInner, iInner + 6));
                             str = str.concat(brStr);
                             console.log("str str str is:"+str);
                             iInner = iInner + 6;
                             //str = str + "\n";
                             //mapping++;
                             }

                             if (data.substring(iInner, iInner + 9) == '<Content>') {
                             var arrayContent = [];
                             while (data.substring(iInner - 10, iInner) != "</Content>") {
                             arrayContent.push(data.charAt(iInner));
                             iInner++;
                             }
                             var tempStr = arrayContent.join("");
                             tempStr = tempStr.replace("<Content>", "<span>");
                             tempStr = tempStr.replace("</Content>", "</span>");
                             str = str.concat(tempStr);
                             console.log("str str str is:"+str);
                             //str = str + "\n";
                             //mapping++;
                             }
                             }

                             console.log("first:" + str);
                             oStoryContent[storyName]=str;
                             storyStore.setStoreData(str);

                             });
                             })();

                             }
                             //////////////////////////////////////////////////////////////

                             */
                            /* var AppControllerFactory = React.createFactory(AppController);

                             var renderedComponent = React.renderToString(
                             AppControllerFactory({
                             store: layoutStore,
                             storyStore: storyStore,
                             ref: "domReference"
                             })                                //({store: HomeScreenStore, MenuStore: MenuStore})
                             );

                             var Handlebars = require('handlebars');


                             var fileData = fs.readFileSync(__dirname + '/template/layout.handlebars').toString();
                             var layoutTemplate = Handlebars.compile(fileData);

                             var renderedLayout = layoutTemplate({
                             content: renderedComponent
                             });


                             var express = require('express');
                             var app = express();

                             app.get('/', function (req, res) {
                             res.send(renderedLayout);
                             });

                             // NOTE: This route is last since we want to match the dynamic routes above
                             // first before attempting to match a static resource (js/css/etc)
                             app.use(express.static('./'));

                             app.listen(3500, function () {
                             console.log("Listening on port 3500");
                             });
                             */
                            /*


                             ////////////////////////////////////////////////////


                             }
                             })();

                             }*/


                            var AppControllerFactory = React.createFactory(AppController);

                            var renderedComponent = React.renderToString(
                                AppControllerFactory({
                                    store: layoutStore,
                                    storyStore: storyStore,
                                    ref: "domReference"
                                })
                            );

                            var Handlebars = require('handlebars');


                            var fileData = fs.readFileSync(__dirname + '/template/layout.handlebars').toString();
                            var layoutTemplate = Handlebars.compile(fileData);

                            var renderedLayout = layoutTemplate({
                                content: renderedComponent
                            });


                            var express = require('express');
                            var app = express();

                            app.get('/', function (req, res) {
                                res.send(renderedLayout);
                            });

                            // NOTE: This route is last since we want to match the dynamic routes above
                            // first before attempting to match a static resource (js/css/etc)
                            app.use(express.static('./'));

                            app.listen(3500, function () {
                                console.log("Listening on port 3500");
                            });
                        }
                    });

                });
            })();
        }
        //});
    });
});


/*
 * Assumptions:
 *  Page Size does not vary in the same doc
 *
 * */