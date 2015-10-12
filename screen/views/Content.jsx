var React = require("react");
//var EventDispatcher = require('./../../libraries/eventDispacher/EventDispatcher');
//var utils=require('../store/utils');

var Events = {

};

var Content = React.createClass({


  propTypes:{
    data: React.PropTypes.object ,
    parent:React.PropTypes.object
  },

  render: function () {
    console.log("in Content"+this.props.data);
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
