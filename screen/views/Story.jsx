var React = require("react");
var _ = require('lodash');

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
  TAB_KEY_PRESSED: "tab_key_pressed",
  ON_KEY_DOWN: "on_key_down"
};


var Story = React.createClass({

  propTypes: {
    data: React.PropTypes.object,  // individual story data
    pathToUpdate: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  renderStoryData: function (obj) {
    var aStory = [];
    var storyLen = (obj['idPkg:Story'].Story.length);
    for (var i = 0; i < storyLen; i++) {
      var sPath = obj['idPkg:Story'].Story[i]['$']['Self'];
      for (var j = 0; j < (obj['idPkg:Story'].Story[i].Custom).length; j++) {
        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var aToXMLElement = obj['idPkg:Story'].Story[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement
                  key={j}
                  pathToUpdate={this.props.pathToUpdate}
                  data={aToXMLElement}
                  path={sPath}/>
          );
        }


        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
          var aToParagraphStyleRange = obj['idPkg:Story'].Story[i].Custom[j].ParagraphStyleRange;
          var AppliedParagraphStyle = aToParagraphStyleRange[0].$.AppliedParagraphStyle;
          var cssName = utils.getParaStyleName(AppliedParagraphStyle);
          aStory.push(
              <ParagraphStyleRange
                  key={j}
                  data={aToParagraphStyleRange}
                  path={sPath}
                  styleName={cssName}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }
      }
    }
    return aStory;
  },

  handleContentBlur: function (oEvent) {
    if (window.getSelection()) {
      var spyFlag=0;
      var targetUID;
      var currentDom;
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      if (spyFlag == 0) {

        if (range.commonAncestorContainer.previousSibling && sel.focusNode.previousSibling.className.indexOf("br") > (-1)){
          currentDom = range.commonAncestorContainer.previousSibling;
        }
        else if (sel.focusNode.nextSibling && sel.focusNode.nextSibling.className.indexOf("br") > (-1)){
          currentDom = range.commonAncestorContainer.nextSibling;
        }

        if(currentDom){
          targetUID = currentDom.getAttribute("data-uid");
          spyFlag = 1;
        }
      }
      if (spyFlag == 0) {
        currentDom = range.commonAncestorContainer.parentNode;
        targetUID = currentDom.getAttribute("data-uid");

      }

      EventDispatcher.dispatch(Events.CONTENT_CHANGE_EVENT, this, sel, targetUID,spyFlag);
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
        //targetUID = currentDom.getAttribute("data-uid");
        var targetPath = currentDom.getAttribute("data-path") + "/" + currentDom.getAttribute("data-uid");
      }
      else {
        currentDom = range.commonAncestorContainer.lastChild;
        //targetUID = currentDom.getAttribute("data-uid");
        var targetPath = currentDom.getAttribute("data-path") + "/" + currentDom.getAttribute("data-uid");
      }
      EventDispatcher.dispatch(Events.ENTER_KEY_PRESSSED, this, oEvent, sel, key, targetPath);
    }
  },

  handleBackspacePress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom = range.commonAncestorContainer.parentNode;
      var targetPath = currentDom.getAttribute("data-path") + "/" + currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.BACKSPACE_KEY_PRESSED, this, oEvent, sel, targetPath);
    }
  },

  handleDeletePress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom = range.commonAncestorContainer.parentNode;
      //var targetUID = currentDom.getAttribute("data-uid");
      var targetPath = currentDom.getAttribute("data-path") + "/" + currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.DELETE_KEY_PRESSED, this, oEvent, sel, targetPath);
    }
  },

  handleTabPress: function (oEvent) {
    if (window.getSelection()) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var currentDom = range.commonAncestorContainer.parentNode;
      //var targetUID = currentDom.getAttribute("data-uid");
      var targetPath = currentDom.getAttribute("data-path") + "/" + currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.TAB_KEY_PRESSED, this, oEvent, sel, targetPath);
    }
  },

  handleKeyDown: function (oEvent) {
    oEvent.preventDefault();
    /*if (oEvent.keyCode == 13) {
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
     }*/

    EventDispatcher.dispatch(Events.ON_KEY_DOWN, this, oEvent);

  },

  componentDidUpdate: function () {

    var oOldSelection = this.props.caretPosition.oSelection;
    if (oOldSelection.rangeCount) {
      var oRange = this.props.caretPosition.oRange;
      var iOffset = this.props.caretPosition.endOffset;

      if(oRange.startContainer.firstChild) {
        oRange.setStart(oRange.startContainer.firstChild, iOffset);
      } else {
        oRange.setStart(oRange.startContainer, iOffset);
      }

      if(oRange.endContainer.firstChild) {
        oRange.setEnd(oRange.endContainer.firstChild, iOffset);
      } else {
        oRange.setEnd(oRange.endContainer, iOffset);
      }

      var DOM = this.refs.storyContainer.getDOMNode();
      var oSelection = window.getSelection();
      oSelection.removeAllRanges();
      oSelection.addRange(oRange);

      DOM.focus();
    }

  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var sPath = this.props.data['idPkg:Story'].Story[0]['$']['Self'];
    return _.contains(nextProps.pathToUpdate, sPath);
  },

  render: function () {
    var wrapperArray = this.renderStoryData(this.props.data);
    return (
        <div className="storyContainer"
             ref="storyContainer"
             contentEditable={true}
             onKeyDown={this.handleKeyDown}>
          {wrapperArray}
        </div>
    );
  }

});

module.exports = {
  view: Story,
  events: Events
};