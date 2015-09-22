var React = require('react');
var utils = require('../store/utils');

var Spread = require('./Spread.jsx');


var Canvas = React.createClass({

  render: function () {
    var obj = this.props.layoutStoreData;
    var pageDimObj = utils.getPageDimension(obj[0], 0);
    var pageHeight = pageDimObj.height;
    console.log("obj length is:" + obj.length);
    var spreadCount = obj.length;

    var cHeight = (spreadCount * (pageHeight + 144)) + (72 * 2) + (36 * (spreadCount - 1));
    var cWidth = (2448 * 2);
    var oCstyle = {
      padding: "72px",
      height: cHeight + "px",
      width: cWidth + "px",
      //position: "absolute",
      left: "100px",
      top: "100px"
      //zIndex: 0
    };

    console.log("in canvas");
    var toSpread = this.props.layoutStoreData;

    return (

        <div className="canva" style={oCstyle}>
          <Spread layoutStoreData={toSpread} storyStoreData={this.props.storyStoreData}/>
        </div>
    );
  }
});

module.exports = Canvas;