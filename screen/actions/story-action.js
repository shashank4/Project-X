var React=require("react");
var EventBusClass=require("../../libraries/eventDispacher/EventDispatcher");
var appController= require('../controller/app-controller.jsx');
var storyStore= require("../store/storyStore");
var ContentEvent = require('./../views/Content.jsx').events;

var storyAction = (function () {

  var handleContentTextChanged = function (oContext, sData, aContentData) {
    storyStore.handleContentTextChanged(sData, aContentData);
  };

  return {
    registerEvent: function () {
      EventBusClass.addEventListener(ContentEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
    },
    deRegisterEvent: function () {
      EventBusClass.removeEventListener(ContentEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
    }
  }

})();

module.exports=storyAction;