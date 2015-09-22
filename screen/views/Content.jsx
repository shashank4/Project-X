var React = require("react");

var Content = React.createClass({
  render: function () {
    console.log("in Content");
    return (<div className="contentContainer" data-wrapper="content">
      <div  className="content" dangerouslySetInnerHTML={{__html: this.props.data}} />
    </div>);
  }

});

module.exports = Content;