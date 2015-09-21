var fs=require('fs');
var xmldom=require('xmldom').DOMParser;
var xpath = require('xpath');

var data;
var dirPath;

var store = (function () {

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

        setDirPath:function(path1){
            dirPath=path1;
        },

        setFilePath:function(fName){
            fName="Story_"+fName+".xml";
            return dirPath+fName;
        },

        getXmlDom:function(filePath){
            console.log("File path is:"+filePath);
            var selectedNodes=0;
            fs.readFile(filePath, function (err, fileData1) {
                var toString=fileData1.toString();
                var doc = new xmldom().parseFromString(toString);

                var contentNodes = xpath.select("//Content", doc);
                for(var i=0;i<contentNodes.length;i++) {
                    contentNodes[i].setAttribute("selectNode","kTrue");
                }

                var brNodes = xpath.select("//Br", doc);
                for(var i=0;i<brNodes.length;i++) {
                    brNodes[i].setAttribute("selectNode","kTrue");
                }

                //console.log("++++++++++++++++++++++++++++++++++++"+doc);
                /*selectedNodes = xpath.select("/*//*[contains(@selectNode, 'kTrue')]",doc);
                console.log("/////////////////////"+selectedNodes.length);
                var nodeMapping2=1000;
                for(var j=0;j<selectedNodes.length;j++){
                    selectedNodes[i].setAttribute("nodeMapping",nodeMapping2++);
                    console.log("node: " + selectedNodes[j].toString());
                }*/

                return selectedNodes;
            });
        },

        getCharaStyleName:function(node){
            var CharacterStyleRange = xpath.select("..", node);

            /*var tempTest=xpath.select("../..", nodes[i]);
             console.log("grandParent is:=="+tempTest);*/
            var thisParent="/..";
            var temp2=(CharacterStyleRange.toString());
            while(temp2.search('CharacterStyleRange')==(-1)){
                CharacterStyleRange = xpath.select(".."+thisParent, node);
                thisParent=thisParent+thisParent;
                temp2=(CharacterStyleRange.toString());
            }

            var tempStr1=CharacterStyleRange.toString();
            if(tempStr1.search('CharacterStyleRange')!=(-1))
            {
                var IDIndex=tempStr1.search('CharacterStyle/');
                var reqIndex=IDIndex+15;
                var startIndex=reqIndex;
                while(tempStr1.charAt(reqIndex)!='"'){
                    reqIndex++;
                }
                var styleName=tempStr1.substring(startIndex,reqIndex);

                if(styleName.search('No character style')!=(-1)){
                    styleName="";
                }
                else{
                    do{
                        styleName=styleName.replace(" ","-");
                    }while(styleName.search(" ")!=(-1));
                }
                //console.log("character styleName is:"+styleName);

            }
            return styleName;

        },

        getParaStyleName:function(node){

            var ParagraphStyleRange = xpath.select("..", node);

            //var tempTest=xpath.select("../..", node);
            //console.log("grandParent is:=="+tempTest);
            var thisParent="/..";
            var temp2=(ParagraphStyleRange.toString());
            while(temp2.search('ParagraphStyleRange')==(-1)){
                ParagraphStyleRange = xpath.select(".."+thisParent, node);
                thisParent=thisParent+thisParent;
                temp2=(ParagraphStyleRange.toString());
            }

            var tempStr1=ParagraphStyleRange.toString();
            if(tempStr1.search('ParagraphStyleRange')!=(-1))
            {
                var IDIndex=tempStr1.search('ParagraphStyle/');
                var reqIndex=IDIndex+15;
                var startIndex=reqIndex;
                while(tempStr1.charAt(reqIndex)!='"'){
                    reqIndex++;
                }
                var styleName=tempStr1.substring(startIndex,reqIndex);

                if(styleName.search('NormalParagraphStyle')!=(-1)){
                    styleName="Basic-Paragraph";
                }
                else{
                    do{
                        styleName=styleName.replace(" ","-");
                    }while(styleName.search(" ")!=(-1));
                }
                //console.log("styleName is:"+styleName);
            }
            return styleName;
        },


        getXmlTag:function(node){

            //var XMLElement =xpath.select('//*[ancestor::foo[bar[@attr="val"]]]',node);



            var XMLElement = xpath.select("..", node);

            //var tempTest=xpath.select("../..", node);
            //console.log("grandParent is:=="+tempTest);
            var thisParent="/..";
            var temp2=(XMLElement.toString());
            while(temp2.search('XMLElement')==(-1)){
                XMLElement = xpath.select(".."+thisParent, node);
                thisParent=thisParent+thisParent;
                temp2=(XMLElement.toString());
            }

            var tempStr1=XMLElement.toString();
            if(tempStr1.search('XMLElement')!=(-1))
            {
                var IDIndex=tempStr1.search('Self=');
                var reqIndex=IDIndex+6;
                var startIndex=reqIndex;
                while(tempStr1.charAt(reqIndex)!='"'){
                    reqIndex++;
                }
                var tagSelf=tempStr1.substring(startIndex,reqIndex);

                var IDIndex2=tempStr1.search('XMLTag/');
                var reqIndex2=IDIndex2+7;
                var startIndex2=reqIndex2;
                while(tempStr1.charAt(reqIndex2)!='"'){
                    reqIndex2++;
                }
                var tagName=tempStr1.substring(startIndex2,reqIndex2);
                var aReturn=[];
                aReturn[0]=tagSelf;
                aReturn[1]=tagName;
            }
            return aReturn;
        }
    };
})();

module.exports=store;