var React = require('react');
var Story = require('./story.jsx').view;
var utils = require('../store/utils');

var Frame = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    pageDimObj: React.PropTypes.object,
    bindingLocation: React.PropTypes.number,
    storyStoreData: React.PropTypes.object,
    pathToUpdate: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  getBindingLocation: function () {
    return this.props.bindingLocation;
  },

  getFramesView: function (obj2) {

    var storyData = JSON.stringify((this.props.storyStoreData));

    var bindingLocation = this.getBindingLocation();
    var aFr = [];
    var halfPageHeight = utils.getHalfPageHeight(obj2);
    var obj = {};

    var pageWidth = this.props.pageDimObj.width;

    var topLeftR = [], leftBottomR = [], rightBottomR = [], topRightR = [];
    var topLeft = [], leftBottom = [], rightBottom = [], topRight = [];


    if (obj2.hasOwnProperty("Rectangle")) {

      for (var y = 0; y < obj2.Rectangle.length; y++) {
        obj = obj2.Rectangle[y];
        var tempItemTransform = obj.$.ItemTransform;
        var itemTransformR = tempItemTransform.split(" ");

        for (var r = 0; r < 4; r++) {
          var pointR = [];

          var anchorPointWithoutSplit = (obj.Properties[0].PathGeometry[0].GeometryPathType[0].PathPointArray[0].PathPointType[r].$.Anchor);
          var anchorPointR = anchorPointWithoutSplit.split(" ");
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
          }
        }


        var height = Math.abs(topLeftR[1] - rightBottomR[1]);
        var width = Math.abs(topLeftR[0] - rightBottomR[0]);

        var tempLeft1;
        /* if(bindingLocation!=0)
         tempLeft1=topLeftR[0]+612+612;
         else*/
        tempLeft1 = topLeftR[0] + (2 * pageWidth);


        var oStyle = {
          height: height + "px",
          width: width + "px",
          position: "absolute",
          left: tempLeft1 + "px",
          top: topLeftR[1] + 72 + "px",
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
        tempLeft = topLeft[0] + (2 * pageWidth);

        var oStyle2 = {
          height: height2 + "px",
          width: width2 + "px",
          position: "absolute",
          left: tempLeft + "px",
          top: topLeft[1] + 72 + "px",
          zIndex: 100
        };


        var toStoryStoreData = (this.props.storyStoreData);
        var storyName = obj.$.ParentStory;

        aFr.push(
            <div className="frame" style={oStyle2} key={z}>
              <Story
                  data={toStoryStoreData[storyName]}
                  caretPosition={this.props.caretPosition}
                  pathToUpdate={this.props.pathToUpdate}/>
            </div>);
      }
    }
    return (aFr);
  },

  render: function () {
    var aFrames = this.getFramesView(this.props.data);
    return (
        <div className="frameContainer">{aFrames}</div>
    );
  }
});

module.exports = Frame;