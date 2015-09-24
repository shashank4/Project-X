var fs = require('fs');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var $= require('jquery');

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
    },

    handleSaveClick: function(){
      $.ajax({
        type: 'POST',
        url: 'onClickSave',
        dataType: 'JSON',
        data: data/*JSON.stringify(data)*/,
        success: function(resultData) { alert("Save Complete") }
      });

    }

  };
})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;