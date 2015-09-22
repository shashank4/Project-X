var React = require("react");
var uniq = 0;
var Br = React.createClass({
  render: function () {
    console.log("in Br");
    return (<div className="brContainer">
              <br className="br" key={uniq++}/>
            </div>);
  }

});

module.exports = Br;
