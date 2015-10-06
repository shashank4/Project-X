var React = require("react");
var react_select=require("react-select");
var Rangy=require('rangy');

//var storyStore=require("../store/storyStore.js");
var utils = require("../store/utils");
var XMLElement = require("./XMLElement.jsx");
var ParagraphStyleRange = require("./paragraphStyleRange.jsx");
var EventDispatcher=require("../../libraries/eventDispacher/EventDispatcher");



var Events = {
  CONTENT_CHANGE_EVENT: "content_change_event",
  ENTER_KEY_PRESSSED:"enter_key_presssed",
  BACKSPACE_KEY_PRESSED:"backspace_key_pressed"
};


var Story = React.createClass({

  propTypes: {
    data: React.PropTypes.object  // individual story data
  },


  handleContentBlur: function (oEvent) {
    if(window.getSelection()){
      var sel=window.getSelection();
      var range=sel.getRangeAt(0);
      var currentDom=range.commonAncestorContainer.parentNode;
      var targetUID=currentDom.getAttribute("data-uid");
      EventDispatcher.dispatch(Events.CONTENT_CHANGE_EVENT, this, sel,targetUID);
    }
  },


  renderStoryData: function (obj) {
    var uniq = 0;
    var aStory = [];
    var storyLen = (obj['idPkg:Story'].Story.length);
    for (var i = 0; i < storyLen; i++) {
      for (var j = 0; j < (obj['idPkg:Story'].Story[i].Custom).length; j++) {

        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var aToXMLElement = obj['idPkg:Story'].Story[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement data={aToXMLElement} key={uniq++} />
          );
        }


        if ((obj['idPkg:Story'].Story[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
          var aToParagraphStyleRange = obj['idPkg:Story'].Story[i].Custom[j].ParagraphStyleRange;
          var AppliedParagraphStyle = aToParagraphStyleRange[0].$.obj['idPkg:Story'].Story[i].Custom[j].AppliedParagraphStyle;
          var cssName = utils.getParaStyleName2(AppliedParagraphStyle);
          aStory.push(
              <ParagraphStyleRange key={uniq++} data={aToParagraphStyleRange} styleName={cssName} />
          );
        }
      }
    }
    return aStory;
  },


  handleEnterKeyPress:function(oEvent){
    oEvent.preventDefault();
    if(window.getSelection()){
      var sel=window.getSelection();
      var range=sel.getRangeAt(0);
      var currentDom=range.commonAncestorContainer.parentNode;
      var targetUID=currentDom.getAttribute("data-uid");
      var key="data-uid";
      EventDispatcher.dispatch(Events.ENTER_KEY_PRESSSED, this, oEvent, sel,key,targetUID);
    }
  },

  handleBackspacePress:function(oEvent){
    if(window.getSelection()){
      var sel=window.getSelection();
      var range=sel.getRangeAt(0);
      var currentDom=range.commonAncestorContainer.parentNode;
      var targetUID=currentDom.getAttribute("data-uid");
      if(sel.focusOffset<2){
        oEvent.preventDefault();

      }
    }

  },


  handleKeyDown: function (oEvent) {
    if (oEvent.keyCode == 13) {
      this.handleEnterKeyPress(oEvent);
    }

    if(oEvent.keyCode==8){
      this.handleBackspacePress(oEvent);
    }



  },


  render: function () {
    console.log("in story...");
    //console.log("Story Name is:"+this.props.storyName);
    var wrapperArray = this.renderStoryData(this.props.data);
    return (
        <div className="storyContainer"
        contentEditable={true}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleContentBlur}
        >
        {wrapperArray}
        </div>
    );//contentEditable={true} onKeyUp={this.handleKeyDown} options={options}
  }


  /*<Select
   name="form-field-name"
   value="one"
   onKeyUp={this.handleKeyUp}
   />*/

});

module.exports = {
  view:Story,
  events:Events
};