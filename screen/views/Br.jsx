var React = require("react");

var Br = React.createClass({
  propTypes:{
    data: React.PropTypes.array ,
    path: React.PropTypes.string
  },

  render: function () {
    var myUID = this.props.data[0]["$"]["data-uid"];
    var sPath = this.props.path;
    var uniq = 0;
    return (
        <br className="br brContainer"
                 data-uid={myUID}
                 data-path={sPath}/>
    );
  }

});

module.exports = Br;
