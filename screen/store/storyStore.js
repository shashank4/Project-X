var fs = require('fs');
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var $ = require('jquery');
var _ = require('lodash');

var MicroEvent = require('../../libraries/microEvent/MicroEvent');
var utils=require('../store/utils');

var storyStore = (function () {

  var data = {};

  var _triggerChange = function () {
    storyStore.trigger('change');
  };

  return {
    setStoreData: function (data1) {
      data = data1;
    },

    getStoreData: function () {
      return data;
    },

    selfSearch: function(obj,uuid){
      var objects = [];
      for (var i in obj) {
          if (obj[i]["$"] && obj[i]["$"]["data-uid"] && obj[i]["$"]["data-uid"] == uuid && typeof obj[i] == 'object') {
            return obj[i];
          } else if (typeof obj[i] == 'object') {
            objects = this.selfSearch(obj[i], uuid);
            if (objects) {
              return objects;
            }
          }
      }
    },

    handleContentTextChanged: function (sel, uuid) {

      var oContent=this.selfSearch(data,uuid);
      oContent["_"] = sel.focusNode.data;
      _triggerChange();
    },

    handleEnterPressed: function (childNodes,aContentData,aParent) {
      console.log("Enter key pressed in the story..."+childNodes[0].data);
      _.forEach(aParent, function(oCustom, iIndex) {
        if(oCustom.Content && oCustom.Content[0] == aContentData) {

          var rest = aParent.splice(iIndex +1);
          aParent.splice(iIndex,1);
          for(var i=0;i<childNodes.length;i++){

            var letters = /^[A-Za-z]+$/;
            if(letters.test(childNodes[i].data)){
              var newContentObj = {"Content": [childNodes[i].data]};
              aParent.push(newContentObj);
            }
            else{
              var newBrObj = {"Br": [""]};
              aParent.push(newBrObj);
            }
          }
          _.assign(aParent, aParent.concat(rest));
          return false;
        }
      });
      _triggerChange();
    },

    handleBackspacePressed:function(oEvent,aContentData,aParent){
      var sel = getSelection();
      if(sel.focusOffset==0){
        oEvent.preventDefault();

        _.forEach(aParent, function(oCustom, iIndex) {
          if(oCustom.Content && oCustom.Content[0] == aContentData) {

            var rest = aParent.splice(iIndex+1);
            var currentNode=aParent.splice(iIndex,1);
            var deletedNode=aParent.splice(iIndex-1,1);
            var previousContent=aParent.splice(iIndex-2,1);
            var preData=previousContent[0].Content[0];
            var currentData=currentNode[0].Content[0];
            previousContent[0].Content[0]=preData.concat(currentData);

           /* _.assign(previousContent, previousContent.concat(rest));
            _.assign(aParent, aParent.concat(previousContent));*/

            _.assign(aParent, aParent.concat(previousContent));
            _.assign(aParent, aParent.concat(rest));
            return false;
          }
        });
        _triggerChange();
      }

    },


    getObjects: function (obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if ( i == "Custom" && typeof obj[i] == 'object') {
          for (var j = 0; j < obj[i].length; j++) {
            if (obj[i][j].Content && obj[i][j].Content[0]["$"]["data-uid"] == val) {
              return obj[i];
            } else if(typeof obj[i][j] == 'object'){
              objects = this.getObjects(obj[i][j], key, val);
              if(objects) {
                return objects;
              }
            }
          }
        } else if (typeof obj[i] == 'object') {
          objects = this.getObjects(obj[i], key, val);
          if(objects) {
            return objects;
          }
        }
      }
    },


    handleEnterKeyPress:function(sel,key,targetUID){

      var aParent=this.getObjects(data,key,targetUID);
      var aContentData=sel.focusNode.data;

      var offset=sel.focusOffset;

      for(var iIndex=0;iIndex<aParent.length;iIndex++){
        var oCustom=aParent[iIndex];
        if(oCustom.Content && oCustom.Content[0]["_"] == aContentData) {

          var rest = aParent.splice(iIndex +1);
          aParent.splice(iIndex,1);

          var newUid=utils.generateUUID();
          var newContentStringBefore=aContentData.substring(0,offset);
          var newContentObjBefore = {"Content":[{"_":newContentStringBefore,"$":{"data-uid":newUid}}]};
          aParent.push(newContentObjBefore);

          var newUid2=utils.generateUUID();
          var newBrObj = {"Br": [{"$":{"data-uid":newUid2}}]};
          aParent.push(newBrObj);

          var newUid3=utils.generateUUID();
          var newContentStringAfter=aContentData.substring(offset,aContentData.length);
          var newContentObjAfter = {"Content":[{"_":newContentStringAfter,"$":{"data-uid":newUid3}}]};
          aParent.push(newContentObjAfter);

          _.assign(aParent, aParent.concat(rest));
          break;
        }
      }
      _triggerChange();

    },



    handleSaveClick: function () {
      $.ajax({
        type: 'POST',
        url: 'onClickSave',
        dataType: 'JSON',
        data: data/*JSON.stringify(data)*/,
        success: function (resultData) {
          alert("Save Complete");
        }
      });
    }


  };
})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;