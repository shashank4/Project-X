var React = require("react");

var Events = {

};

var Content = React.createClass({


  propTypes:{
    data: React.PropTypes.array ,
    parent:React.PropTypes.array,
    path: React.PropTypes.string
  },

  render: function () {
    var contentData=this.props.data[0]["_"];
    var myUID=this.props.data[0]["$"]["data-uid"];
    var sPath = this.props.path;

    return (
      <span  className="content contentContainer"
        ref="contentContainer"
        data-uid={myUID}
        data-path={sPath}
      >
      {contentData}
      </span>);
  }
});

module.exports = {
  view: Content,
  events: Events
};
