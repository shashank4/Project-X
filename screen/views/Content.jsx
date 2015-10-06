var React = require("react");
//var EventDispatcher = require('./../../libraries/eventDispacher/EventDispatcher');
//var utils=require('../store/utils');

var Events = {
  CONTENT_CHANGE_EVENT: "content_change_event",
  ENTER_KEY_PRESSSED:"enter_key_presssed",
  BACKSPACE_KEY_PRESSED:"backspace_key_pressed"
};

var Content = React.createClass({


  propTypes:{
    data: React.PropTypes.object ,
    parent:React.PropTypes.object
  },


  /*handleKeyPress:function(oEvent){
    if(oEvent.keyCode==13) {
      //EventDispatcher.dispatch(Events.ENTER_KEY_PRESSSED, this, oEvent.currentTarget.childNodes, this.props.data, this.props.parent);
    }
  },

  handleKeyDown:function(oEvent){
    if(oEvent.keyCode==8) {
      console.log("Control comes here...BACKSPACE");
      EventDispatcher.dispatch(Events.BACKSPACE_KEY_PRESSED, this, oEvent, this.props.data, this.props.parent);
    }
  },*/


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

      /* onKeyUp={this.handleKeyPress}
     onKeyDown={this.handleKeyDown}*///dangerouslySetInnerHTML={{__html: contentData}}
  }
});

module.exports = {
  view: Content,
  events: Events
};
