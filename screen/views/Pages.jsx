var React = require('react');
var Frame = require('./frame.jsx');
var utils = require('../store/utils');

var Pages = React.createClass({


  propTypes: {
    data: React.PropTypes.object
  },

  getPagesView: function (obj) {
    var pageVisitCount = 0;
    var aPg = [];
    var left = 0;
    var pageCount = (parseInt(obj['idPkg:Spread'].Spread[0].$.PageCount));
    for (var i = 0; i < pageCount; i++) {

      var oPageDim = utils.getPageDimension(obj, i);

      var height = oPageDim.height;
      var width = oPageDim.width;
      var bindingLocation = parseInt(obj['idPkg:Spread'].Spread[0].$.BindingLocation);

      if (bindingLocation == 0 && pageCount == 1)
        left = (width * 2);
      else
        left = left + width;

      var oStyle = {
        height: height + "px",
        width: width + "px",
        position: "absolute",
        left: left + "px",
        top: 72 + "px"
      };
      var oMstyle = {
        height: (height - 72) + "px",
        width: (width - 72) + "px",
        position: "absolute",
        left: "36px",
        top: "36px"
      };

      if (pageVisitCount == 0) {
        pageVisitCount++;
        aPg.push(
            <div className="page" style={oStyle} key={pageVisitCount}>
              <div className="innerpage" style={oMstyle}/>
            </div>);
      }
      else {
        pageVisitCount++;
        aPg.push(
            <div className="page" style={oStyle} key={pageVisitCount}>
              <div className="innerpage" style={oMstyle} key={pageVisitCount + 1000} />
            </div>);
      }
    }
    return (aPg);
  },
  render: function () {
    var aPages = this.getPagesView(this.props.data);
    return (
        <div>
              {aPages}
        </div>
    );
  }
});

module.exports = Pages;