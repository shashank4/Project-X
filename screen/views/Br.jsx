var React = require("react");
var uniq = 0;
var Br = React.createClass({
  render: function () {
    console.log("in Br");
    return ( <br className="br brContainer" key={uniq++} /> );
  }

});

module.exports = Br;
