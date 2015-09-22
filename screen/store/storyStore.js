var fs = require('fs');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');

var store = (function () {

    var data = {};

    return {
        setStoreData: function (data1) {
            console.log("setStoreData of story");
            data = data1;
            //console.log("setStore:"+data+"  kjghdkfghdkfhg  "+data1);
        },

        getStoreData: function () {
            //console.log("getStoreData of story:"+data);
            return data;
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

        getCharaStyleName: function (node) {
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
        }
    };
})();

module.exports = store;