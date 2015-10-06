var React=require("react");
var EventBusClass=require("../../libraries/eventDispacher/EventDispatcher");
//var appController= require('../controller/app-controller.jsx');
var storyStore= require("../store/storyStore");
var ContentEvent = require('./../views/content.jsx').events;
var AppControllerEvent=require('../controller/app-controller.jsx').events;
var StoryEvent=require('../views/Story.jsx').events;

var storyAction = (function () {

  var handleContentTextChanged = function (oContext, sel,targetUID) {
    storyStore.handleContentTextChanged(sel,targetUID);
  };

  var handleSaveButonClick=function(){
    storyStore.handleSaveClick();
  };

  var handleEnterKeyPressed=function(oContext,childNodes,aContentData, aParent){
    console.log("in the action");
    storyStore.handleEnterPressed(childNodes,aContentData,aParent);
  };

  var handleEnterKeyPressed2=function(oContext,oEvent, sel,key,targetUID){
    console.log("in the action");
    storyStore.handleEnterKeyPress(sel,key,targetUID);

  };

  var handleBackspace=function(oContext,oEvent,aContentData,aParent){
    console.log("in the backSpace");
    storyStore.handleBackspacePressed(oEvent,aContentData,aParent);
  };


  return {
    registerEvent: function () {
      EventBusClass.addEventListener("save_button_clicked", handleSaveButonClick);
      EventBusClass.addEventListener(StoryEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      //EventBusClass.addEventListener(ContentEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed);
      EventBusClass.addEventListener(ContentEvent.BACKSPACE_KEY_PRESSED,handleBackspace);
      EventBusClass.addEventListener(StoryEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed2);
    },
    deRegisterEvent: function () {
      EventBusClass.removeEventListener("save_button_clicked", handleSaveButonClick);
      EventBusClass.removeEventListener(StoryEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      //EventBusClass.removeEventListener(ContentEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed);
      EventBusClass.removeEventListener(ContentEvent.BACKSPACE_KEY_PRESSED,handleBackspace);
      EventBusClass.removeEventListener(StoryEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed2);
    }
  }

})();

module.exports=storyAction;