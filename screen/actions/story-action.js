var React=require("react");
var EventBusClass=require("../../libraries/eventDispacher/EventDispatcher");
//var appController= require('../controller/app-controller.jsx');
var storyStore= require("../store/storyStore");
var ContentEvent = require('./../views/content.jsx').events;
var AppControllerEvent=require('../controller/app-controller.jsx').events;

var storyAction = (function () {

  var handleContentTextChanged = function (oContext, sData, aContentData) {
    storyStore.handleContentTextChanged(sData, aContentData);
  };

  var handleSaveButonClick=function(){
    storyStore.handleSaveClick();
  };

  return {
    registerEvent: function () {
      EventBusClass.addEventListener(ContentEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      EventBusClass.addEventListener("save_button_clicked", handleSaveButonClick);
    },
    deRegisterEvent: function () {
      EventBusClass.removeEventListener(ContentEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      EventBusClass.removeEventListener("save_button_clicked", handleSaveButonClick);
    }
  }

})();

module.exports=storyAction;