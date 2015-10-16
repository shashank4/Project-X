var React = require("react");
var uniq = 0;
var Br = React.createClass({
  propTypes:{
    data: React.PropTypes.array ,
    path: React.PropTypes.string
  },

  render: function () {
    var myUID = this.props.data[0]["$"]["data-uid"];
    var sPath = this.props.path;
    return (
        <br className="br brContainer"
                 key={uniq++}
                 data-uid={myUID}
                 data-path={sPath}
            />
    );
  }

});

module.exports = Br;
