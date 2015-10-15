/*var fs = require('fs');
 var xmldom = require('xmldom').DOMParser;
 var xpath = require('xpath');*/
var $ = require('jquery');
var _ = require('lodash');

var MicroEvent = require('../../libraries/microEvent/MicroEvent');
var utils = require('../store/utils');

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
    },

    selfSearch: function (obj, uuid) {
      var objects = [];
      for (var i in obj) {
        if (obj[i] && obj[i]["$"]
            && obj[i]["$"]["data-uid"]
            && obj[i]["$"]["data-uid"] == uuid
            && typeof obj[i] == 'object') {
          return obj[i];
        }
        else if (typeof obj[i] == 'object') {
          objects = this.selfSearch(obj[i], uuid);
          if (objects) {
            return objects;
          }
        }
      }
    },

    searchClosestCustomOfContentNBr: function (obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (i == "Custom" && typeof obj[i] == 'object') {
          for (var j = 0; j < obj[i].length; j++) {
            if (obj[i][j].Content && obj[i][j].Content[0]["$"]["data-uid"] == val) {
              var parentUUID = obj["$"]["data-uid"];
              return {objectPos: obj[i], indexPos: j, patentUID: parentUUID, flag: 0};
            } else if (obj[i][j].Br) {
              if (obj[i][j].Br[0]["$"]["data-uid"] == val) {
                var parentUUID2 = obj["$"]["data-uid"];
                return {objectPos: obj[i], indexPos: j, patentUID: parentUUID2, flag: 1};
              }
            } else if (typeof obj[i][j] == 'object') {
              objects = this.searchClosestCustomOfContentNBr(obj[i][j], key, val);
              if (objects) {
                return objects;
              }
            }
          }
        } else if (typeof obj[i] == 'object') {
          objects = this.searchClosestCustomOfContentNBr(obj[i], key, val);
          if (objects) {
            return objects;
          }
        }
      }
    },

    searchClosestCustomOfPara: function (obj, uuid) {
      var objects = [];
      for (var i in obj) {
        if (i == "Custom") {
          for (var j = 0; j < obj[i].length; j++) {
            if (obj[i][j].ParagraphStyleRange
                && obj[i][j].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0]["$"]["data-uid"] == uuid) {
              return {reqObj: obj[i], iIndex: j};
            }
            else if (typeof obj[i][j] == 'object') {
              objects = this.searchClosestCustomOfPara(obj[i][j], uuid);
              if (objects) {
                return objects;
              }
            }
          }
        } else if (typeof obj[i] == 'object') {
          objects = this.searchClosestCustomOfPara(obj[i], uuid);
          if (objects) {
            return objects;
          }
        }
      }
    },

    searchClosestCustomOfXmltag: function (obj, uuid) {
      var objects = [];
      for (var i in obj) {
        if (obj[i] && obj[i].XMLElement
            && obj[i].XMLElement[0].Custom && obj[i].XMLElement[0].Custom[0].Content
            && obj[i].XMLElement[0].Custom[0].Content[0]["$"]["data-uid"] == uuid && typeof obj[i] == 'object') {
          return {reqObj: obj, iIndex: i};
        } else if (typeof obj[i] == 'object') {
          objects = this.searchClosestCustomOfXmltag(obj[i], uuid);
          if (objects) {
            return objects;
          }
        }
      }
    },

    searchClosestCustomOfChara: function (obj, uuid) {
      var objects = [];
      for (var i in obj) {
        if (i == "Custom") {
          for (var j = 0; j < obj[i].length; j++) {
            if (obj[i][j].CharacterStyleRange
                && obj[i][j].CharacterStyleRange[0]["$"]["data-uid"] == uuid) {
              return {reqObj: obj[i], iIndex: j};
            }
            else if (typeof obj[i][j] == 'object') {
              objects = this.searchClosestCustomOfChara(obj[i][j], uuid);
              if (objects) {
                return objects;
              }
            }
          }
        } else if (typeof obj[i] == 'object') {
          objects = this.searchClosestCustomOfChara(obj[i], uuid);
          if (objects) {
            return objects;
          }
        }
      }
    },

    handleContentTextChanged: function (sel, uuid, spyFlag) {

      if ((sel.focusNode.nextSibling
            && sel.focusNode.nextSibling.className.indexOf("br") > (-1))
          ||
          ((sel.focusNode.previousSibling
            && sel.focusNode.previousSibling.className.indexOf("br") > (-1)))) {

        var oParentCustom = this.searchClosestCustomOfContentNBr(data, "data-uid", uuid);
        var aCustom = oParentCustom.objectPos;
        var index = oParentCustom.indexPos;
        var newContentStringBefore = sel.focusNode.data;

        var newUid = utils.generateUUID();
        var newContentObj = {"Content": [{"_": newContentStringBefore, "$": {"data-uid": newUid}}]};

        if (sel.focusNode.previousSibling && sel.focusNode.previousSibling.className.indexOf("br") > (-1)) {
          aCustom.splice(index + 1, 0, newContentObj);
          _triggerChange();

        } else if (sel.focusNode.nextSibling && sel.focusNode.nextSibling.className.indexOf("br") > (-1)) {
          if (index != 0){
            aCustom.splice(index - 1, 0, newContentObj);
            aCustom.splice(-1);
          }
          else{
            aCustom.splice(index, 0, newContentObj);
          }
          _triggerChange();
        }


      } else {
        var oContent = this.selfSearch(data, uuid);
        oContent["_"] = sel.focusNode.data;
        _triggerChange();
      }
    },

    handleEnterKeyPress: function (sel, key, targetUID) {

      var returnedObject = this.searchClosestCustomOfContentNBr(data, key, targetUID);
      var aContentData = sel.focusNode.data;
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var flag = returnedObject.flag;
      var offset = sel.focusOffset;

      if(sel.focusNode.firstChild && sel.focusNode.firstChild.className.indexOf('br')>(-1)){

        var newUid7 = utils.generateUUID();
        var newBrObj7 = {"Br": [{"$": {"data-uid": newUid7}}]};
        aParent.splice(0,0,newBrObj7);
        _triggerChange();
        return;
      }

      if (flag == 1) {
        var newUid5 = utils.generateUUID();
        var newBrObj5 = {"Br": [{"$": {"data-uid": newUid5}}]};
        _.assign(aParent, aParent.push(newBrObj5));
        _triggerChange();

      } else {

        if(offset==0 && iIndex==0){
          var newUid6 = utils.generateUUID();
          var newBrObj6 = {"Br": [{"$": {"data-uid": newUid6}}]};
          aParent.splice(iIndex, 0, newBrObj6);
          _triggerChange();
        }else{
          var rest = aParent.splice(iIndex + 1);
          aParent.splice(iIndex, 1);

          var newUid = utils.generateUUID();
          var newContentStringBefore = aContentData.substring(0, offset);
          var newContentObjBefore = {"Content": [{"_": newContentStringBefore, "$": {"data-uid": newUid}}]};
          aParent.push(newContentObjBefore);

          var newUid2 = utils.generateUUID();
          var newBrObj = {"Br": [{"$": {"data-uid": newUid2}}]};
          aParent.push(newBrObj);

          if (sel.focusNode.length == sel.focusOffset
              && sel.focusNode.parentNode.nextSibling == null
              && sel.focusNode.parentNode.parentNode.nextSibling == null
              && sel.focusNode.parentNode.parentNode.parentNode.nextSibling == null) {
            var newUid4 = utils.generateUUID();
            var newBrObjExtreemLast = {"Br": [{"$": {"data-uid": newUid4}}]};
            aParent.push(newBrObjExtreemLast);
          }

          if (offset < aContentData.length) {
            var newUid3 = utils.generateUUID();
            var newContentStringAfter = aContentData.substring(offset, aContentData.length);
            var newContentObjAfter = {"Content": [{"_": newContentStringAfter, "$": {"data-uid": newUid3}}]};
            aParent.push(newContentObjAfter);
          }
          _.assign(aParent, aParent.concat(rest));
          _triggerChange();
        }


      }

    },

    handleBackspacePressed: function (oEvent, sel, targetUID) {

      if(sel.focusNode.nodeName != "#text" && sel.focusNode.firstChild
          && sel.focusNode.firstChild.className.indexOf('br') > (-1)){
        oEvent.preventDefault();
        if(sel.focusNode.parentNode.previousSibling.lastChild.lastChild.className.indexOf('br')>(-1)){
          var currentDom=sel.focusNode.parentNode.previousSibling.lastChild.lastChild;
          var targetUIDLocal = currentDom.getAttribute("data-uid");
          var returnedObjectLocal = this.searchClosestCustomOfContentNBr(data,"data-uid",targetUIDLocal);
          var aParentLocal = returnedObjectLocal.objectPos;
          aParentLocal.splice(aParentLocal.length-1,1);
          _triggerChange();
          return;
        }
      }

      var returnedObject = this.searchClosestCustomOfContentNBr(data, "data-uid", targetUID);
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var parentUID = returnedObject.patentUID;

      if (sel.focusOffset == 0) {
        oEvent.preventDefault();

        /**
         * if iIndex th node is not the start node.....then do normal processing
         * i.e. remove the previous node ......remove previous BR and append next content data
         * to previous content data.
         */
        if (iIndex != 0) {
          if (aParent[iIndex - 1].Br) {                 /*if previous node is br*/
            var rest = aParent.splice(iIndex + 1);
            var currentNode = aParent.splice(iIndex, 1);
            aParent.splice(iIndex - 1, 1);

            if (aParent.length != 0) {
              var previousContent = aParent.splice(iIndex - 2, 1);
              var preData = previousContent[0].Content[0]["_"];
              var currentData = currentNode[0].Content[0]["_"];
              previousContent[0].Content[0]["_"] = preData.concat(currentData);
              _.assign(aParent, aParent.concat(previousContent));
            }
            _.assign(aParent, aParent.concat(rest));
            _triggerChange();
          }

        }
        else {
          /**
           * Paragraph Handling
           */
          if (sel.focusNode.parentNode.parentNode.className.indexOf("characterContainer") > (-1)) {

            var oReturned = this.searchClosestCustomOfPara(data, parentUID);
            var aCustomPara = oReturned.reqObj;
            var iIndexPara = oReturned.iIndex;

            if (iIndexPara != 0) {
              var last1 = aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom.length;
              var last2 = aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom[last1 - 1].CharacterStyleRange.length;
              var last3 = aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom[last1 - 1].CharacterStyleRange[last2 - 1].Custom.length;
              aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom[last1 - 1].CharacterStyleRange[last2 - 1].Custom.splice(last3 - 1, 1);
              aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom = aCustomPara[iIndexPara - 1].ParagraphStyleRange[0].Custom.concat(aCustomPara[iIndexPara].ParagraphStyleRange[0].Custom);
              var restPara = aCustomPara.splice(iIndexPara + 1);
              aCustomPara.splice(iIndexPara, 1);
              _.assign(aCustomPara, aCustomPara.concat(restPara));
              _triggerChange();
            }
          }
        }

      }
      else if (sel.focusNode.data.length == 1) {
        oEvent.preventDefault();
        if (aParent.length == 1) {

          /**
           * xml tag :either you can totally remove or normal processing
           */
          if (sel.focusNode.parentNode.parentNode.className == "xmlElementContainer") {
            var oUltimateParent = this.searchClosestCustomOfXmltag(data, targetUID);
            var aUltimateCustom = oUltimateParent.reqObj;
            var jIndex = oUltimateParent.iIndex;

            var restUltimate = aUltimateCustom.splice(jIndex + 1);
            aUltimateCustom.splice(jIndex, 1);
            _.assign(aUltimateCustom, aUltimateCustom.concat(restUltimate));
            _triggerChange();
          }

          /**
           * characterStyleRange handling
           */
          if (sel.focusNode.parentNode.parentNode.className.indexOf("characterContainer") > (-1)) {
            var oCharacterOfParent = this.searchClosestCustomOfChara(data, parentUID);
            var aCustom = oCharacterOfParent.reqObj;
            var charIndex = oCharacterOfParent.iIndex;
            if (aCustom.length > 1) {
              if (aCustom[charIndex + 1] && aCustom[charIndex - 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle == aCustom[charIndex + 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle) {
                if (aCustom[charIndex + 2])
                  var restArray = aCustom.splice(charIndex + 2);
                var last = aCustom[charIndex - 1].CharacterStyleRange[0].Custom.length - 1;
                if (aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content && aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content) {
                  aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"] = aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"] + aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"];
                  aCustom[charIndex + 1].CharacterStyleRange[0].Custom.splice(0, 1);
                }

                if (aCustom[charIndex + 1].CharacterStyleRange[0].Custom.length > 0) {
                  aCustom[charIndex - 1].CharacterStyleRange[0].Custom = aCustom[charIndex - 1].CharacterStyleRange[0].Custom.concat(aCustom[charIndex + 1].CharacterStyleRange[0].Custom);
                }

                aCustom.splice(charIndex + 1);
                aCustom.splice(charIndex);

                if (restArray) {
                  _.assign(aCustom, aCustom.concat(restArray));
                }
                _triggerChange();
              } else if (charIndex == (aCustom.length - 1)) {
                aCustom.splice(charIndex, 1);
                _triggerChange();
              }


            } else if (aCustom.length == 1) {
              console.log("you are going right bro....");
            }

          }

        }
        else if (aParent.length > 1) {
          /**
           * delete only current node and append all other remaining to previous.
           */
          if ((iIndex + 1) != aParent.length) {
            var afterNodes = aParent.splice(iIndex + 1);
          }
          aParent.splice(iIndex, 1);
          if (afterNodes) {
            _.assign(aParent, aParent.concat(afterNodes));
          }
          _triggerChange();
        }
      }

    },

    handleDeletePressed: function (oEvent, sel, targetUID) {
      /**
       * delete cases...
       * 1)if entire charastyle or xmltagv is ddeleted.----combine twwo contents...after and before waala.
       * 2)if next sibling is br then remove br and check fro before and after charastylesa if same then combine.
       * 3)if
       *
       */

      var returnedObject = this.searchClosestCustomOfContentNBr(data, "data-uid", targetUID);
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var parentUID = returnedObject.patentUID;
      if (sel.focusOffset == aParent[iIndex].Content[0]["_"].length) {
        if (iIndex <= aParent.length - 2) {
          if (aParent[iIndex + 1].Br) {
            oEvent.preventDefault();
            if (aParent[iIndex + 2]) {
              aParent[iIndex].Content[0]["_"] = aParent[iIndex].Content[0]["_"].concat(aParent[iIndex + 2].Content[0]["_"])
            }
            aParent.splice(iIndex + 1, 2);
            _triggerChange();

          } else if (aParent[iIndex + 1].XMLElement) {
            oEvent.preventDefault();
            var str = aParent[iIndex + 1].XMLElement[0].Custom[0].Content[0]["_"];
            if (str.length != 1) {
              aParent[iIndex + 1].XMLElement[0].Custom[0].Content[0]["_"] = str.slice(0, 0) + str.slice(1, str.length);
            } else {
              aParent[iIndex + 1].XMLElement[0].Custom.splice(0, 1);
            }
            _triggerChange();
          }

        } else if (iIndex == aParent.length - 1) {
          var oCharacterOfParent = this.searchClosestCustomOfChara(data, parentUID);
          var aCustom = oCharacterOfParent.reqObj;
          var charIndex = oCharacterOfParent.iIndex;
          if (aCustom[charIndex + 1]) {
            if (aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"].length != 1) {
              oEvent.preventDefault();
              var tempStr = aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"];
              aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"] = tempStr.slice(0, 0) + tempStr.slice(1, tempStr.length);
              _triggerChange();
            } else {
              if (aCustom[charIndex + 1].CharacterStyleRange[0].Custom.length == 1) {
                if (aCustom[charIndex + 2]) {
                  oEvent.preventDefault();
                  if (aCustom[charIndex].CharacterStyleRange[0]["$"].AppliedCharacterStyle == aCustom[charIndex + 2].CharacterStyleRange[0]["$"].AppliedCharacterStyle) {
                    aCustom[charIndex].CharacterStyleRange[0].Custom[0].Content[0]["_"] = aCustom[charIndex].CharacterStyleRange[0].Custom[0].Content[0]["_"]
                    + aCustom[charIndex + 2].CharacterStyleRange[0].Custom[0].Content[0]["_"];
                    aCustom.splice(charIndex + 1, 2);
                    _triggerChange();
                  } else {
                    aCustom.splice(charIndex + 1, 1);
                    _triggerChange();
                  }
                }
              }
            }
          }
        }
      }
    },

    handleTabPressed:function(oEvent, sel, uuid){
      oEvent.preventDefault();
      var tenSpaces = "          ";

      if(sel.focusNode.firstChild && sel.focusNode.firstChild.className.indexOf("br") > (-1)){
        var oChara = this.selfSearch(data, uuid);
        var newUid2 = utils.generateUUID();
        var newContentObj2 = {"Content": [{"_": tenSpaces, "$": {"data-uid": newUid2}}]};
        oChara.Custom.splice(0,0,newContentObj2);
        _triggerChange();
      } else {
        var str=sel.focusNode.data;
        var offset=sel.focusOffset;
        var preText=str.substring(0,offset);
        var postText=str.substring(offset,str.length);
        var oContent = this.selfSearch(data, uuid);
        oContent["_"] = preText+tenSpaces+postText;
        _triggerChange();
      }
    }
  }

})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;