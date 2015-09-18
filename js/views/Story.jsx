var React=require("react");
//var storyStore=require("../store/storyStore.js");

var XMLElement=require("./XMLElement.jsx");
var ParagraphStyleRange=require("./ParagraphStyleRange.jsx");

var Story =React.createClass({


    renderStoryData:function(obj){
        //console.log("In the story"+JSON.stringify(obj));
        var uniq=0;
        var aStory=[];
        var storyLen=(obj['idPkg:Story'].Story.length);
        for(var i=0;i<storyLen;i++) {
            if((obj['idPkg:Story'].Story[i]).hasOwnProperty("XMLElement")){
                var aToXMLElement=obj['idPkg:Story'].Story[i].XMLElement;
                aStory.push(
                    <div key={uniq++}>
                        <XMLElement data={aToXMLElement}/>
                    </div>
                );
            }


            if((obj['idPkg:Story'].Story[i]).hasOwnProperty("ParagraphStyleRange")){
                var aToParagraphStyleRange=obj['idPkg:Story'].Story[i].ParagraphStyleRange;
                aStory.push(
                    <div key={uniq++}>
                        <ParagraphStyleRange data={aToParagraphStyleRange}/>
                    </div>
                );
            }

        }



        return aStory;
    },


    render: function () {
        console.log("in story...");
        //console.log("Story Name is:"+this.props.storyName);
        var wrapperArray = this.renderStoryData(this.props.data);
        return (
            <div >
          {wrapperArray}
            </div>
        );
    }


});

module.exports=Story;