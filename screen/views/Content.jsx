var React = require("react");
var EventDispatcher = require('./../../libraries/eventDispacher/EventDispatcher');

var Events = {
  CONTENT_CHANGE_EVENT: "content_change_event"
};

var Content = React.createClass({

  handleContentBlur: function (oEvent) {
    console.log('In Content VIew');
    console.log(oEvent.target.innerText);
    EventDispatcher.dispatch(Events.CONTENT_CHANGE_EVENT, this, oEvent.target.innerText, this.props.data);
  },

  render: function () {
    console.log("in Content");
    return (<div className="contentContainer" data-wrapper="content">
      <div  className="content"
        contentEditable={true}
        dangerouslySetInnerHTML={{__html: this.props.data}}
        onBlur={this.handleContentBlur}
      />
    </div>);
  }

});

module.exports = {
  view: Content,
  events: Events
};
