var React = require("react");

var Events = {

};

var Content = React.createClass({


  propTypes:{
    data: React.PropTypes.array ,
    parent:React.PropTypes.array
  },

  render: function () {
    var contentData=this.props.data[0]["_"];
    var myUID=this.props.data[0]["$"]["data-uid"];

    return (
      <span  className="content contentContainer"
        ref="contentContainer"
        data-uid={myUID}
      >
      {contentData}
      </span>);
  }
});

module.exports = {
  view: Content,
  events: Events
};
