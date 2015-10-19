var React = require('react');
var Canvas = require('../views/canvas.jsx');
var EventDispatcher = require('./../../libraries/eventDispacher/EventDispatcher');

var Events={
  SAVE_BUTTON_CLICKED:"save_button_clicked"
};


var AppController = React.createClass({

  propTypes: {
    layoutStore: React.PropTypes.object,
    storyStore: React.PropTypes.object,
    action: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      storyData: {},
      layoutData: []
    }
  },

  componentWillMount: function () {
    this.storyStateChanged();
    this.props.action.registerEvent();
  },

  //@UnBind: store with state
  componentWillUnmount: function () {
    this.props.storyStore.unbind('change', this.storyStateChanged);
    this.props.action.deRegisterEvent();
  },

  //@Bind: Store with state
  componentDidMount: function () {
    this.props.storyStore.bind('change', this.storyStateChanged);
  },

  storyStateChanged: function () {
    this.setState({
      storyData: this.props.storyStore.getStoreData(),
      layoutData: this.props.layoutStore.getStoreData()
    });
  },

  handleOnClick: function() {
    EventDispatcher.dispatch(Events.SAVE_BUTTON_CLICKED);

  },

  render: function () {
    var sPathToUpdate = this.props.storyStore.getPathToUpdate();
    var oCaretPosition = this.props.storyStore.getCaretPosition();
    return (
        <div className="appController">
         <button className="myButton" onClick={this.handleOnClick}>Save</button>
          <Canvas
              layoutStoreData={this.state.layoutData}
              storyStoreData={this.state.storyData}
              pathToUpdate={sPathToUpdate}
              caretPosition={oCaretPosition}/>
        </div>
    );
  }
});


module.exports = {
  view: AppController,
  events: Events
};
