var React = require('react');
var utils = require('../store/utils');

var Spread = require('./Spread.jsx');


var Canvas = React.createClass({

  propTypes: {
    layoutStore: React.PropTypes.object,
    storyStore: React.PropTypes.object,
    pathToUpdate: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  render: function () {
    var obj = this.props.layoutStoreData;
    var pageDimObj = utils.getPageDimension(obj[0], 0);
    var pageHeight = pageDimObj.height;
    var spreadCount = obj.length;

    var cHeight = (spreadCount * (pageHeight + 144)) + (72 * 2) + (36 * (spreadCount - 1));
    var cWidth = (2448 * 2);
    var oCstyle = {
      padding: "20px",
      height: cHeight + "px",
      width: cWidth + "px",
      position: "relative"
    };

    var toSpread = this.props.layoutStoreData;

    return (

        <div className="canvasWrapper">
          <div className="canva" style={oCstyle}>
            <Spread
              layoutStoreData={toSpread}
              storyStoreData={this.props.storyStoreData}
              pathToUpdate={this.props.pathToUpdate}
              caretPosition={this.props.caretPosition}/>
          </div>
        </div>
    );
  }
});

module.exports = Canvas;