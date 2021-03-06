var React = require("react");

var utils = require("../store/utils");
var XMLElement = require("./XMLElement.jsx");
var ParagraphStyleRange = require("./paragraphStyleRange.jsx");
var EventDispatcher = require("../../libraries/eventDispacher/EventDispatcher");
var storyAction = require("../actions/story-action");
var Events = {
  CONTENT_CHANGE_EVENT: "content_change_event",
  ENTER_KEY_PRESSSED: "enter_key_presssed",
  BACKSPACE_KEY_PRESSED: "backspace_key_pressed",
  DELETE_KEY_PRESSED: "delete_key_pressed",
  TAB_KEY_PRESSED: "tab_key_pressed"
};


var Story = React.createClass({

  propTypes: {
    data: React.PropTypes.object  // individual story data
  },

  renderStoryData: function (obj) {

    var aStory = [];
    var storyLen = (obj['idPkg:Story'].Story.length);
    for (var i = 0; i < storyLen; i++) {
      for (var j = 0; j < (obj['idPkg:Story'].Story[i].Custom).length; j++) {
        var uniq = utils.generateUUID();
        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var aToXMLElement = obj['idPkg:Story'].Story[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement data={aToXMLElement} key={uniq} />
          );
        }


        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
          var aToParagraphStyleRange = obj['idPkg:Story'].Story[i].Custom[j].ParagraphStyleRange;
          var AppliedParagraphStyle = aToParagraphStyleRange[0].$.AppliedParagraphStyle;
          var cssName = utils.getParaStyleName(AppliedParagraphStyle);
          aStory.push(
              <ParagraphStyleRange key={uniq} data={aToParagraphStyleRange} styleName={cssName} />
          );
        }
      }
    }
    return aStory;
  },

  handleContentBlur: function (oEvent) {
    if (window.getSelection()) {
      var spyFlag = 0;
      var targetUID;
      var currentDom;
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      if (spyFlag == 0) {

        if (range.commonAncestorContainer.previousSibling && sel.focusNode.previousSibling.className.indexOf("br") > (-1)) {
          currentDom = range.commonAncestorContainer.previousSibling;
        }
        else if (sel.focusNode.nextSibling && sel.focusNode.nextSibling.className.indexOf("br") > (-1)) {
          currentDom = range.commonAncestorContainer.nextSibling;
        }

        if (currentDom) {
          targetUID = currentDom.getAttribute("data-uid");
          spyFlag = 1;
        }
      }
      if (spyFlag == 0) {
        currentDom = range.commonAncestorContainer.parentNode;
        targetUID = currentDom.getAttribute("data-uid");

      }

      EventDispatcher.dispatch(Events.CONTENT_CHANGE_EVENT, this, sel, targetUID, spyFlag);
    }
  },

  handleEnterKeyPress: function (oEvent) {
    oEvent.preventDefault();
    var key = "data-uid";
    var targetUID;
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom;
      if (sel.focusNode.nodeName == "#text") {
        currentDom = range.commonAncestorContainer.parentNode;
        targetUID = currentDom.getAttribute("data-uid");
      }
      else {
        currentDom = range.commonAncestorContainer.lastChild;
        targetUID = currentDom.getAttribute("data-uid");
      }
      EventDispatcher.dispatch(Events.ENTER_KEY_PRESSSED, this, oEvent, sel, key, targetUID);
    }
  },

  handleBackspacePress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom;
      var targetUID;
      currentDom = range.commonAncestorContainer.parentNode;
      targetUID = currentDom.getAttribute("data-uid");

      EventDispatcher.dispatch(Events.BACKSPACE_KEY_PRESSED, this, oEvent, sel, targetUID);
    }
  },

  handleDeletePress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom = range.commonAncestorContainer.parentNode;
      var targetUID = currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.DELETE_KEY_PRESSED, this, oEvent, sel, targetUID);
    }
  },

  handleTabPress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom = range.commonAncestorContainer.parentNode;
      var targetUID = currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.TAB_KEY_PRESSED, this, oEvent, sel, targetUID);
    }
  },

  handleKeyDown: function (oEvent) {
    if (oEvent.keyCode == 13) {
      this.handleEnterKeyPress(oEvent);
    }

    if (oEvent.keyCode == 8) {
      this.handleBackspacePress(oEvent);
    }

    if (oEvent.keyCode == 46) {
      this.handleDeletePress(oEvent);
    }

    if (oEvent.keyCode == 9) {
      this.handleTabPress(oEvent);
    }
  },

  render: function () {
    var wrapperArray = this.renderStoryData(this.props.data);
    return (
        <div className="storyContainer"
        contentEditable={true}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleContentBlur}>
        {wrapperArray}
        </div>
    );
  }

});

module.exports = {
  view: Story,
  events: Events
};