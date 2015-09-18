var React= require("react");
//var XMLElement=require('')
var ParagraphStyleRange=require("./ParagraphStyleRange.jsx");
var CharacterStyleRange=require("./CharacterStyleRange.jsx");
var Content=require("./Content.jsx");
var Br=require("./Br.jsx");


var XMLElement=React.createClass({

    getAXmlElements:function(obj){
        var aStory=[];
        var uniq=0;
        var objLen=obj.length;
        for(var i=0;i<objLen;i++) {

            if((obj[i]).hasOwnProperty("XMLElement")){
                var aToXMLElement=obj[i].XMLElement;
                aStory.push(
                    <div key={uniq++}>
                        <XMLElement data={aToXMLElement}/>
                    </div>
                );
            }


            if((obj[i]).hasOwnProperty("ParagraphStyleRange")){
                var aToParagraphStyleRange=obj[i].ParagraphStyleRange;
                aStory.push(
                    <div key={uniq++}>
                        <ParagraphStyleRange data={aToParagraphStyleRange}/>
                    </div>
                );
            }


            if((obj[i]).hasOwnProperty("CharacterStyleRange")){
                var aCharacterStyleRange=obj[i].CharacterStyleRange;
                aStory.push(
                    <div key={uniq++}>
                        <CharacterStyleRange data={aCharacterStyleRange}/>
                    </div>
                );
            }


            if((obj[i]).hasOwnProperty("Content")){
                var aContent=obj[i].Content;
                aStory.push(
                    <div key={uniq++}>
                        <Content data={aContent}/>
                    </div>
                );
            }


            if((obj[i]).hasOwnProperty("Br")){
                var aBr=obj[i].Br;
                aStory.push(
                    <div key={uniq++}>
                        <Br data={aBr}/>
                    </div>
                );
            }

        }
        return aStory;
    },

    render:function(){
        console.log("in XMLElement");
        var aXmlElements=this.getAXmlElements(this.props.data);
        return (
            <div>
                {aXmlElements}
            </div>
        );
    }

});

module.exports=XMLElement;