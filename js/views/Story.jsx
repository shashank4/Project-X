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
            for(var j=0;j<(obj['idPkg:Story'].Story[i].Custom).length;j++) {

                if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("XMLElement")) {
                    console.log("ïn 1st if");
                    var aToXMLElement = obj['idPkg:Story'].Story[i].Custom[j].XMLElement;
                    aStory.push(
                            <XMLElement data={aToXMLElement} key={uniq++}/>
                    );
                }


                if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
                    console.log("ïn 2nd if");
                    var aToParagraphStyleRange = obj['idPkg:Story'].Story[i].Custom[j].ParagraphStyleRange;
                    aStory.push(
                            <ParagraphStyleRange key={uniq++} data={aToParagraphStyleRange}/>
                    );
                }
            }

        }



        return aStory;
    },


    render: function () {
        console.log("in story...");
        //console.log("Story Name is:"+this.props.storyName);
        var wrapperArray = this.renderStoryData(this.props.data);
        return (
            <div className="storyContainer">
          {wrapperArray}
            </div>
        );
    }


});

module.exports=Story;