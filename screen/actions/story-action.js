var React = require("react");
var EventBusClass = require("../../libraries/eventDispacher/EventDispatcher");
var storyStore = require("../store/storyStore");
var StoryEvent = require('../views/Story.jsx').events;
var ListEvent = require('../views/List.jsx').events;
var SpreadEvent = require('../views/Spread.jsx').events;

var storyAction = (function () {

  var handleSaveButonClick = function () {
    storyStore.handleSaveClick();
  };

  var handleContentTextChanged = function (oContext, sel, targetUID, spyFlag) {
    storyStore.handleContentTextChanged(sel, targetUID, spyFlag);
  };

  var handleEnterKeyPressed = function (oContext, oEvent, sel, key, targetUID) {
    storyStore.handleEnterKeyPress(sel, key, targetUID);
  };

  var handleBackspace = function (oContext, oEvent, sel, targetUID) {
    storyStore.handleBackspacePressed(oEvent, sel, targetUID);
  };

  var handleDelete = function (oContext, oEvent, sel, targetUID) {
    storyStore.handleDeletePressed(oEvent, sel, targetUID);
  };

  var handleTab=function(oContext, oEvent, sel, targetUID){
    storyStore.handleTabPressed(oEvent, sel, targetUID);
  };

  var handleOnKeyDown = function (oContext, oEvent) {
    storyStore.handleOnKeyDown(oEvent);
  };

  var handleListItemClicked = function(oContext, sStyleType, oEvent){
    storyStore.handleListItemClicked(sStyleType, oEvent);
  };

  var handleSpreadClicked = function(oContext){
    storyStore.handleSpreadClicked();
  };

  return {
    registerEvent: function () {
      console.log(SpreadEvent);
      EventBusClass.addEventListener("save_button_clicked", handleSaveButonClick);
      EventBusClass.addEventListener(StoryEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      EventBusClass.addEventListener(StoryEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed);
      EventBusClass.addEventListener(StoryEvent.BACKSPACE_KEY_PRESSED, handleBackspace);
      EventBusClass.addEventListener(StoryEvent.DELETE_KEY_PRESSED, handleDelete);
      EventBusClass.addEventListener(StoryEvent.TAB_KEY_PRESSED, handleTab);
      EventBusClass.addEventListener(StoryEvent.ON_KEY_DOWN, handleOnKeyDown);
      EventBusClass.addEventListener(ListEvent.LIST_ITEM_CLICKED, handleListItemClicked);
      EventBusClass.addEventListener(SpreadEvent.SHOW_STYLE, handleSpreadClicked);
    },

    deRegisterEvent: function () {
      EventBusClass.removeEventListener("save_button_clicked", handleSaveButonClick);
      EventBusClass.removeEventListener(StoryEvent.CONTENT_CHANGE_EVENT, handleContentTextChanged);
      EventBusClass.removeEventListener(StoryEvent.ENTER_KEY_PRESSSED, handleEnterKeyPressed);
      EventBusClass.removeEventListener(StoryEvent.BACKSPACE_KEY_PRESSED, handleBackspace);
      EventBusClass.removeEventListener(StoryEvent.DELETE_KEY_PRESSED, handleDelete);
      EventBusClass.removeEventListener(StoryEvent.TAB_KEY_PRESSED, handleTab);
      EventBusClass.removeEventListener(StoryEvent.ON_KEY_DOWN, handleOnKeyDown);
      EventBusClass.removeEventListener(ListEvent.LIST_ITEM_CLICKED, handleListItemClicked);
      EventBusClass.removeEventListener(SpreadEvent.SHOW_STYLE, handleSpreadClicked);
    }
  }

})();

module.exports = storyAction;