var React = require('react');
var Canvas = require('../views/canvas.jsx');
var StylesPane = require('../views/StylesPane.jsx');
var EventDispatcher = require('./../../libraries/eventDispacher/EventDispatcher');

var Events={
  SAVE_BUTTON_CLICKED:"save_button_clicked"
};


var AppController = React.createClass({

  propTypes: {
    layoutStore: React.PropTypes.object,
    storyStore: React.PropTypes.object,

    action: React.PropTypes.object
  },//styleStore: React.PropTypes.object,

  getInitialState: function () {
    return {
      storyData: {},
      layoutData: [],
      styleData: {}
    }
  },

  componentWillMount: function () {
    this.storyStateChanged();
    this.props.storyAction.registerEvent();
  },

  //@UnBind: store with state
  componentWillUnmount: function () {
    this.props.storyStore.unbind('change', this.storyStateChanged);
    this.props.storyAction.deRegisterEvent();
  },

  //@Bind: Store with state
  componentDidMount: function () {
    this.props.storyStore.bind('change', this.storyStateChanged);
  },

  storyStateChanged: function () {
    this.setState({
      storyData: this.props.storyStore.getStoreData(),
      layoutData: this.props.layoutStore.getStoreData(),
      styleData: this.props.storyStore.getStyleData(),
      imageData: this.props.storyStore.getImageData()
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
          <div className="toolBarWrapper">
            <button className="myButton" onClick={this.handleOnClick}>Save</button>
          </div>
          <div className="mainContent">
            <StylesPane
              stylesData={this.state.styleData}/>
            <Canvas
              layoutStoreData={this.state.layoutData}
              storyStoreData={this.state.storyData}
              imageStoreData={this.state.imageData}
              pathToUpdate={sPathToUpdate}
              caretPosition={oCaretPosition}/>
          </div>
        </div>
    );
  }
});


module.exports = {
  view: AppController,
  events: Events
};
