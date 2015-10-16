var React = require('react');
var _ = require('lodash');
var Frame = require('./frame.jsx');
var utils = require('../store/utils');

var Pages = React.createClass({


  propTypes: {
    data: React.PropTypes.object
  },

  getPagesView: function () {
    var oPages = this.props.data;
    var aPagesView = [];
    var iLeft = 0;
    var iPageCount = (parseInt(oPages['idPkg:Spread'].Spread[0].$.PageCount));

    _.times(iPageCount, function (iIndex) {
      var oPageDim = utils.getPageDimension(oPages, iIndex);

      var iHeight = oPageDim.height;
      var iWidth = oPageDim.width;
      var iBindingLocation = parseInt(oPages['idPkg:Spread'].Spread[0].$.BindingLocation);

      if (iBindingLocation == 0 && iPageCount == 1)
        iLeft = (iWidth * 2);
      else
        iLeft = iLeft + iWidth;

      var oStyle = {
        height: iHeight + "px",
        width: iWidth + "px",
        position: "absolute",
        left: iLeft + "px",
        top: 72 + "px"
      };
      var oMstyle = {
        height: (iHeight - 72) + "px",
        width: (iWidth - 72) + "px",
        position: "absolute",
        left: "36px",
        top: "36px"
      };

      if (iIndex == 0) {
        aPagesView.push(
            <div className="page" style={oStyle} key={iIndex}>
              <div className="innerpage" style={oMstyle}/>
            </div>);
      }
      else {
        aPagesView.push(
            <div className="page" style={oStyle} key={iIndex}>
              <div className="innerpage" style={oMstyle} key={iIndex + 1000} />
            </div>);
      }
    });

    return (aPagesView);
  },
  render: function () {
    var aPages = this.getPagesView();
    return (
        <div>
              {aPages}
        </div>
    );
  }
});

module.exports = Pages;