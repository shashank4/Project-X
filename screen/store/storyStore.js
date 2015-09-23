var fs = require('fs');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');

var MicroEvent = require('../../libraries/microEvent/MicroEvent');

var storyStore = (function () {

  var data = {};

  var _triggerChange = function () {
    storyStore.trigger('change');
  };

  return {
    setStoreData: function (data1) {
      console.log("setStoreData of story");
      data = data1;
      //console.log("setStore:"+data+"  kjghdkfghdkfhg  "+data1);
    },

    getStoreData: function () {
      //console.log("getStoreData of story:"+data);
      return data;
    },

    handleContentTextChanged: function (sChangedData, aContentData) {
      aContentData[0] = sChangedData;
      _triggerChange();
    }
  };
})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;