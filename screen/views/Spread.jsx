var React = require('react');
var _ = require('lodash');

var Pages = require('./pages.jsx');
var Frame = require('./frame.jsx');
var utils = require('../store/utils');
var EventDispatcher = require("../../libraries/eventDispacher/EventDispatcher");

var Events = {

  SHOW_STYLE : "show_style"

};

var Spread = React.createClass({

  propTypes: {
    layoutStoreData: React.PropTypes.array,
    storyStoreData: React.PropTypes.object,
    imageStoreData: React.PropTypes.object,
    pathToUpdate: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  getSpreadView: function () {
    var aSp = [];
    var iHeight;
    var iTop = 0;
    var aSpreads = this.props.layoutStoreData;

    _.forEach(aSpreads, function (oSpread, iIndex) {
      var iPageCount = parseInt(oSpread['idPkg:Spread'].Spread[0].$.PageCount);
      var iWidth = 1224 + 612;
      if (iPageCount <= 2) {
        iWidth = 2448;
      }
      else {
        for (var j = 1; j < iPageCount; j++) {
          var oTempPageDimension = utils.getPageDimension(oSpread, j);
          iWidth = (iWidth) + oTempPageDimension.width;
        }
      }

      var tempPageDim2 = utils.getPageDimension(oSpread, 0);
      iHeight = tempPageDim2.height + 144;

      if (iIndex != 0) {
        iTop = iTop + iHeight + 36;
      }

      var oStyle = {
        height: iHeight + "px",
        width: iWidth + "px",
        position: "absolute",
        top: iTop +116+ "px",
        left: "36px"
      };

      var oDataToFrame = oSpread['idPkg:Spread'].Spread[0];
      var oPageDimObj = utils.getPageDimension(oSpread, 0);
      var oBindingLocation = parseInt(oSpread['idPkg:Spread'].Spread[0].$.BindingLocation);

      aSp.push(
          <div className="spread" style={oStyle} key={iIndex + 1000}>
            <Pages data={oSpread} />
            <Frame  data={oDataToFrame}
                    caretPosition={this.props.caretPosition}
                    pathToUpdate={this.props.pathToUpdate}
                    pageDimObj={oPageDimObj}
                    bindingLocation={oBindingLocation}
                    storyStoreData={this.props.storyStoreData}
                    imageStoreData={this.props.imageStoreData}/>
          </div>
      );
    }.bind(this));

    return (aSp);
  },

  handleOnClickSpread : function(evt){
    EventDispatcher.dispatch(Events.SHOW_STYLE, this, evt);
  },

  render: function () {
    var aSpreads = this.getSpreadView();
    return (
        <div className="spreadClass" onClick={this.handleOnClickSpread} >
                {aSpreads}
        </div>
    );
  }
});

module.exports = {
  view : Spread,
  events : Events
};