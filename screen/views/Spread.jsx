var React = require('react');
var _ = require('lodash');

var Pages = require('./pages.jsx');
var Frame = require('./frame.jsx');
var utils = require('../store/utils');


var Spread = React.createClass({

  propTypes: {
    layoutStoreData: React.PropTypes.array,
    storyStoreData: React.PropTypes.object
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
                    pageDimObj={oPageDimObj}
                    bindingLocation={oBindingLocation}
                    storyStoreData={this.props.storyStoreData} />
          </div>
      );
    }.bind(this));

    return (aSp);
  },
  render: function () {
    var aSpreads = this.getSpreadView();
    return (
        <div className="spreadClass" >
                {aSpreads}
        </div>
    );
  }
});

module.exports = Spread;