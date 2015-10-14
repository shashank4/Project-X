var React = require('react');

var Pages = require('./pages.jsx');
var Frame = require('./frame.jsx');
var utils = require('../store/utils');


var Spread = React.createClass({

  propTypes: {
    layoutStore: React.PropTypes.object,
    storyStore: React.PropTypes.object
  },

  getSpreadView: function (obj) {
    var aSp = [];
    var height;
    var gTop = 0;
    for (var i = 0; i < obj.length; i++) {

      var pageCount = parseInt(obj[i]['idPkg:Spread'].Spread[0].$.PageCount);
      var width = 1224 + 612;
      if (pageCount <= 2)
        width = 2448;
      else {
        for (var j = 1; j < pageCount; j++) {

          var tempPageDim = utils.getPageDimension(obj[i], j);
          width = (width) + tempPageDim.width;

        }
      }
      var tempPageDim2 = utils.getPageDimension(obj[i], 0);
      height = tempPageDim2.height + 144;

      if (i != 0) {
        gTop = gTop + height + 36;
      }

      var oStyle = {
        height: height + "px",
        width: width + "px",
        position: "absolute",
        top: gTop +116+ "px",
        left: "36px"
      };

      var dataToFrame = obj[i]['idPkg:Spread'].Spread[0];
      var pageDimObj = utils.getPageDimension(obj[i], 0);
      var bindingLocation = parseInt(obj[i]['idPkg:Spread'].Spread[0].$.BindingLocation);

      aSp.push(
          <div className="spread" style={oStyle} key={i + 1000}>
            <Pages data={obj[i]} />
            <Frame  data={dataToFrame}
            pageDimObj={pageDimObj}
            bindingLocation={bindingLocation}
            storyStoreData={this.props.storyStoreData} />
          </div>
      );
    }
    return (aSp);
  },
  render: function () {
    var aSpreads = this.getSpreadView(this.props.layoutStoreData);
    return (
        <div className="spreadClass" >
                {aSpreads}
        </div>
    );
  }
});

module.exports = Spread;