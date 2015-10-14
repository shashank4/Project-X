var React = require("react");
var uniq = 0;
var Br = React.createClass({
  render: function () {
    var myUID=this.props.data[0]["$"]["data-uid"];
    return ( <br className="br brContainer" key={uniq++} data-uid={myUID}/> );
  }

});

module.exports = Br;
