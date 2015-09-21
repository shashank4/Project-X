//var oUtils = require('../../utils.js');
var React = require('react');
var Story=require('./Story.jsx');
var layoutStore = require('../store/layoutStore.js');
var storyStore=require('../store/storyStore.js');

var Frame = React.createClass({

    getBindingLocation:function(){
      return this.props.bindingLocation;
    },

    getFramesView: function (obj2) {
        //console.log("in getFramesView..."+JSON.stringify(obj2));

        var storyData=JSON.stringify(storyStore.getStoreData());

        var bindingLocation=this.getBindingLocation();
        var aFr = [];
        var halfPageHeight = layoutStore.getHalfPageHeight(obj2);
        var obj = {};
        var jSonObject=layoutStore.getStoreData();
        var pageDimObj=layoutStore.getPageDimension(jSonObject[0],0);
        var pageWidth=pageDimObj.width;

        var topLeftR = [], leftBottomR = [], rightBottomR = [], topRightR = [];
        var topLeft = [], leftBottom = [], rightBottom = [], topRight = [];


        if (obj2.hasOwnProperty("Rectangle")) {

            for (var y = 0; y < obj2.Rectangle.length; y++) {
                obj = obj2.Rectangle[y];
                var tempItemTransform = obj.$.ItemTransform;
                var itemTransformR = tempItemTransform.split(" ");

                //console.log("itemTransformR" + itemTransformR);
                for (var r = 0; r < 4; r++) {
                    var pointR = [];

                    var anchorPointWithoutSplit = (obj.Properties[0].PathGeometry[0].GeometryPathType[0].PathPointArray[0].PathPointType[r].$.Anchor);
                    //console.log(anchorPointWithoutSplit);
                    var anchorPointR = anchorPointWithoutSplit.split(" ");
                    //console.log("anchorPointR is:" + anchorPointR[0] + "  and  " + anchorPointR[1]);
                    //console.log("Addition is:" + (parseInt(anchorPointR[0]) + parseInt(anchorPointR[1])));
                    pointR[0] = ((parseInt(anchorPointR[0]) * parseInt(itemTransformR[0])) + (parseInt(anchorPointR[1]) * parseInt(itemTransformR[1])) + parseInt(itemTransformR[4]));
                    pointR[1] = ((parseInt(anchorPointR[0]) * parseInt(itemTransformR[2])) + (parseInt(anchorPointR[1]) * parseInt(itemTransformR[3])) + parseInt(itemTransformR[5]) + halfPageHeight);

                    if (r == 0) {
                        topLeftR = pointR;
                    } else if (r == 1) {
                        leftBottomR = pointR;
                    } else if (r == 2) {
                        rightBottomR = pointR;
                    } else {
                        topRightR = pointR;
                        //break;
                    }
                }


                var height = Math.abs(topLeftR[1] - rightBottomR[1]);
                var width = Math.abs(topLeftR[0] - rightBottomR[0]);
                //console.log("topLeftR X" + topLeftR[0]+"topLeftR Y"+topLeftR[1]);

                var tempLeft1;
               /* if(bindingLocation!=0)
                    tempLeft1=topLeftR[0]+612+612;
                else*/
                    tempLeft1=topLeftR[0]+(2*pageWidth);



                var oStyle = {
                    height: height + "px",
                    width: width + "px",
                    position: "absolute",
                    left: tempLeft1 + "px",
                    top: topLeftR[1]+72 + "px",
                    zIndex: 100
                };

                aFr.push(<div className="frame" style={oStyle}></div>);

            }
        }


        if (obj2.hasOwnProperty("TextFrame")) {

            var objLen = obj2.TextFrame.length;
            for (var z = 0; z < objLen; z++) {
                obj = obj2.TextFrame[z];


                var itemTransformTemp = (obj.$.ItemTransform);
                var itemTransform = itemTransformTemp.split(" ");
                for (var k = 0; k < 4; k++) {
                    var point = [];

                    var anchorPoint = (obj.Properties[0].PathGeometry[0].GeometryPathType[0].PathPointArray[0].PathPointType[k].$.Anchor).split(" ");
                    point[0] = ((parseInt(anchorPoint[0]) * parseInt(itemTransform[0])) + (parseInt(anchorPoint[1]) * parseInt(itemTransform[1])) + parseInt(itemTransform[4]));
                    point[1] = ((parseInt(anchorPoint[0]) * parseInt(itemTransform[2])) + (parseInt(anchorPoint[1]) * parseInt(itemTransform[3])) + parseInt(itemTransform[5]) + halfPageHeight);
                    if (k == 0) {
                        topLeft = point;
                    } else if (k == 1) {
                        leftBottom = point;
                    } else if (k == 2) {
                        rightBottom = point;
                    } else {
                        topRight = point;
                        //break;
                    }
                }
                var height2 = Math.abs(topLeft[1] - rightBottom[1]);
                var width2 = Math.abs(topLeft[0] - rightBottom[0]);

                var tempLeft;
                /*if(bindingLocation!=0)
                    tempLeft=topLeft[0]+612;
                else*/
                    tempLeft=topLeft[0]+(2*pageWidth);

                var oStyle2 = {
                    height: height2 + "px",
                    width: width2 + "px",
                    position: "absolute",
                    left: tempLeft + "px",
                    top: topLeft[1]+72 + "px",
                    zIndex: 100
                };

                /*var parentStory=obj.$.ParentStory;
                //var filePath=storyStore.setFilePath(parentStory);
                var filePath=storyStore.setFilePath('ud9');
                var aXmlDom=storyStore.getXmlDom(filePath);
*/
                var oStyleLocal2={
                    zIndex:200
                };
                var keyVal=0;
                var storyStoreData=storyStore.getStoreData();
                var storyName=obj.$.ParentStory;
                //console.log("11111111111111111111111111111111111111111111111111"+JSON.stringify(storyStoreData[storyName]));

                aFr.push(<div className="frame" style={oStyle2} key={keyVal++}>
                            <Story data={storyStoreData[storyName]} />
                        </div>);//<div dangerouslySetInnerHTML={{__html: storyData}} style={oStyleLocal2} contentEditable={true}/>
            }
        }
        /*console.log("in aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa...");

         var height = Math.abs(topLeft[1] - rightBottom[1]);
         var width = Math.abs(topLeft[0] - rightBottom[0]);
         var oStyle = {
         height: height + "px",
         width: width + "px",
         position: "absolute",
         left: topLeft[0] + "px",
         top: topLeft[1] + "px",
         zIndex: 1
         };*/

        // var containerOfParagraphs = [];
        // var paragraph = [];
        // var spans = [];
        /*for (var j = 0; j < obj[i].FrameContentStyle.ParaStyleArray.length; j++) {
         for (var k = 0; k < obj[i].FrameContentStyle.ParaStyleArray[j].CaraStyleArray.length; k++) {
         spans.push(<span className={obj[i].FrameContentStyle.ParaStyleArray[j].CaraStyleArray[k].StyleClassName}>{obj[i].FrameContentStyle.ParaStyleArray[j].CaraStyleArray[k].textContent}</span>);
         }
         paragraph.push(<p className={obj[i].FrameContentStyle.ParaStyleArray[j].StyleClassName}>{spans}</p>);
         spans = [];
         }*/
        //containerOfParagraphs.push(<div className="Basic-Text-Frame">{paragraph}</div>);
        //paragraph = [];

        //aFr.push(<div className="frame" style={oStyle}></div>);


        return (aFr);
    },

    render: function () {
        console.log("in frames...");

        var aFrames = this.getFramesView(this.props.data);
        return (
            <div className="frameContainer">
          {aFrames}
            </div>
        );
    }
});

module.exports = Frame;