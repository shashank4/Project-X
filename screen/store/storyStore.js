/*var fs = require('fs');
 var xmldom = require('xmldom').DOMParser;
 var xpath = require('xpath');*/
var $ = require('jquery');
var _ = require('lodash');

var MicroEvent = require('../../libraries/microEvent/MicroEvent');
var utils = require('../store/utils');

var UID_KEY = 'data-uid';

var storyStore = (function () {

  var data = {};
  var sPathToUpdate = "";
  var oCaretPosition = {
    oSelection: {},
    oRange: {}
  };

  var _triggerChange = function () {
    storyStore.trigger('change');
  };

  var _setPathTOUpdate = function (sPath) {
    sPathToUpdate = sPath;
  };

  var isCapLockOn = function(e){
    //var charKeyCode = e.keyCode ? e.keyCode : e.which; // To work with both MSIE & Netscape

    var charKeyCode = false;
    if (e.which) {
      charKeyCode = e.which;
    } else if (e.keyCode) {
      charKeyCode = e.keyCode;
    }

    var shiftKey = false;
    if (e.shiftKey) {
      shiftKey = e.shiftKey;
    } else if (e.modifiers) {
      shiftKey = !!(e.modifiers & 4);
    }


// Check both the condition as described above
    if((charKeyCode >= 65 && charKeyCode <= 90 && !shiftKey)
        || (charKeyCode >= 97 && charKeyCode <= 122 && shiftKey))
    {
      return true;  // Caps lock is on
    }
    else{
      return false;  // Caps lock is off.
    }
  };

  return {
    setStoreData: function (data1) {
      data = data1;
    },

    getStoreData: function () {
      return data;
    },

    getPathToUpdate: function () {
      return sPathToUpdate;
    },

    setPathToUpdate: function (sPath) {
      _setPathTOUpdate(sPath);
    },

    getCaretPosition: function () {
      return oCaretPosition;
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

    searchClosestCustomOfContentNBr: function (obj, remainingPath, sParentId) {
      if (obj["Custom"]) {
        var aCustom = obj["Custom"];
        var oClosestCustom;
        _.forEach(aCustom, function (oCustom, iCustomIndex) {
          _.forEach(oCustom, function (oTag, sTagKey) {
            if (oTag[0]['$']) {
              oTag = oTag[0];
              var sCustomTagUID = oTag['$'][UID_KEY];
              if (sCustomTagUID == remainingPath[0]) {
                if (remainingPath.length == 1) {
                  //oClosestCustom = oCustom;
                  oClosestCustom = {
                    objectPos: aCustom,
                    indexPos: iCustomIndex,
                    parentUID: sParentId,
                    flag: (sTagKey == 'Br')
                  };
                } else {
                  remainingPath.splice(0, 1);
                  oClosestCustom = this.searchClosestCustomOfContentNBr(oTag, remainingPath, oTag['$'][UID_KEY]);
                }
                return false;
              }
            }
          }.bind(this));
          if (oClosestCustom) {
            return false;
          }
        }.bind(this));
        return oClosestCustom;
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


    handleContentTextChanged: function (oEvent, sel, targetPath,oCurrentDom) {

      var bIsCapsLock = isCapLockOn(oEvent);
      var pressedChar = String.fromCharCode(oEvent.keyCode);

      if(oEvent.keyCode!=16){ // If the pressed key is anything other than SHIFT
        if(oEvent.keyCode >= 65 && oEvent.keyCode <= 90){ // If the key is a letter
          if(oEvent.shiftKey /*|| bIsCapsLock*/ ){ // If the SHIFT/CAPS key is down, return the ASCII code for the capital letter
            pressedChar = String.fromCharCode(oEvent.keyCode);
          }else{ // If the SHIFT key is not down, convert to the ASCII code for the lowecase letter
            pressedChar = String.fromCharCode(oEvent.keyCode + 32);
          }
        }
      }

      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];

      var oParentCustom = this.searchClosestCustomOfContentNBr(currentStory, path);
      var aCustom = oParentCustom.objectPos;
      var index = oParentCustom.indexPos;


      var uuid = path[path.length - 1];

      /**
       * if key is pressed on any BR node.
       */
      if(oCurrentDom.className.indexOf('br')>(-1)){
        var newUid21 = utils.generateUUID();
        var newContentObj21 = {"Content": [{"_": pressedChar, "$": {"data-uid": newUid21}}]};
        aCustom.splice(index, 0, newContentObj21);
        _triggerChange();
        return;
      }

      /**
       * if a key is pressed either BEFORE or AFTER the BR node...
       */
      if ((sel.focusNode.nextSibling
          && sel.focusNode.nextSibling.className.indexOf("br") > (-1))
          ||
          ((sel.focusNode.previousSibling
          && sel.focusNode.previousSibling.className.indexOf("br") > (-1)))) {

        var newContentStringBefore = sel.focusNode.data.substring(0, sel.focusOffset) + pressedChar
                                      + sel.focusNode.data.substring(sel.focusOffset, sel.length);
        var newUid = utils.generateUUID();
        var newContentObj = {"Content": [{"_": newContentStringBefore, "$": {"data-uid": newUid}}]};

        /**
         * if a key is pressed AFTER the BR node...
         */
        if (sel.focusNode.previousSibling && sel.focusNode.previousSibling.className.indexOf("br") > (-1)) {
          aCustom.splice(index + 1, 0, newContentObj);
          _triggerChange();
          return null;
        }
        /**
         * * if a key is pressed BEFORE the BR node...
         */
        else if (sel.focusNode.nextSibling && sel.focusNode.nextSibling.className.indexOf("br") > (-1)) {
          if (index != 0)
            aCustom.splice(index - 1, 0, newContentObj);
          else
            aCustom.splice(index, 0, newContentObj);

          aCustom.splice(-1);
          _triggerChange();
          return null;
        }
      }
      /**
       * if key is pressed in the middle of the node.(Normal processing)
       */
      else {
        var oContent = this.selfSearch(currentStory, uuid);
        oContent["_"] = sel.focusNode.data.substring(0, sel.focusOffset) + pressedChar
                        + sel.focusNode.data.substring(sel.focusOffset, sel.length);

        _triggerChange();
        return null;
      }
    },

    handleEnterKeyPress: function (oSel, targetPath) {
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = this.searchClosestCustomOfContentNBr(currentStory, path);
      var aContentData = oSel.focusNode.data;
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var bFlag = returnedObject.flag;
      var iOffset = oSel.focusOffset;

      /**
       * true = 'BR' node....if key is down on Br node
       * append directly
       */
      if (bFlag == true) {
        var newUid5 = utils.generateUUID();
        var newBrObj5 = {"Br": [{"$": {"data-uid": newUid5}}]};
        aParent.splice(iIndex,0,newBrObj5);
        _triggerChange();
        return null;
      }
      /**
       * if key is down on content node
       */
      else {
        /**
         * if offset is 0 and first node of character style or xmlElement
         */
        if (iIndex == 0 && iOffset == 0 ) {
          var newUid6 = utils.generateUUID();
          var newBrObj6 = {"Br": [{"$": {"data-uid": newUid6}}]};
          aParent.splice(iIndex, 0, newBrObj6);
          _triggerChange();
          return null;
        }
        /**
         * if  it is NOT first node of character style or xmlElement
         */
        else {
          var rest = aParent.splice(iIndex + 1);
          aParent.splice(iIndex, 1);

          var newUid = utils.generateUUID();
          var newContentStringBefore = aContentData.substring(0, iOffset);
          var newContentObjBefore = {"Content": [{"_": newContentStringBefore, "$": {"data-uid": newUid}}]};
          aParent.push(newContentObjBefore);

          var newUid2 = utils.generateUUID();
          var newBrObj = {"Br": [{"$": {"data-uid": newUid2}}]};
          aParent.push(newBrObj);


          /**
           * if cursor is not at the last position of the current content node.
           * then break the string insert one br and append next string
           */
          if (iOffset < aContentData.length) {
            var newUid3 = utils.generateUUID();
            var newContentStringAfter = aContentData.substring(iOffset, aContentData.length);
            var newContentObjAfter = {"Content": [{"_": newContentStringAfter, "$": {"data-uid": newUid3}}]};
            aParent.push(newContentObjAfter);
          }


          /**
           * if enter is pressed on extreme last position i.e. after last content or br of last Paragraph Node
           * then push one extra br to get cursor on new line.
           */
          if (oSel.focusNode.length == oSel.focusOffset
              && oSel.focusNode.parentNode.nextSibling == null
              && oSel.focusNode.parentNode.parentNode.nextSibling == null
              && oSel.focusNode.parentNode.parentNode.parentNode.nextSibling == null ) {
            var newUid4 = utils.generateUUID();
            var newBrObjExtremeLast = {"Br": [{"$": {"data-uid": newUid4}}]};
            aParent.push(newBrObjExtremeLast);
          }

          _.assign(aParent, aParent.concat(rest));
          _triggerChange();
        }


      }
    },

    handleBackspacePressed: function (oEvent, sel, targetPath) {
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = this.searchClosestCustomOfContentNBr(currentStory, path);
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var parentUID = returnedObject.parentUID;

      if (sel.focusOffset == 0) {

        /**
         * if iIndex th node is not the start node.....then do normal processing
         * i.e. remove the previous node ......remove previous BR and append next content data
         * to previous content data.
         */
        if (iIndex != 0) {
          /**
           * if previous node is br (prev node will always be BR)
           */
          if (aParent[iIndex - 1].Br) {
            var rest = aParent.splice(iIndex + 1);
            var currentNode = aParent.splice(iIndex, 1);
            aParent.splice(iIndex - 1, 1);

            /**
             * if aParent length is  still not 0 after removing current and previous node.
             */
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
           * if iIndex == 0.
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
      /**
       * if there is only one character in the selected node and focusOffset is also 1
       * then remove current node and check, if next and previous node is same or not. If same charaStyle then combine.
       * Check for chara and XML tag.
       */
      else if (sel.focusOffset==1 && sel.focusNode.data.length == 1 ) {
        if (aParent.length == 1) {

          var path2=targetPath.split('/');
          path2.splice(0,1);
          path2.splice(-1,1);
          var oUltimateParent = this.searchClosestCustomOfContentNBr(currentStory, path2);
          var aUltimateCustom = oUltimateParent.objectPos;
          var jIndex = oUltimateParent.indexPos;
          /**
           * xml tag :either you can totally remove or normal processing. We can't combine xml tags.
           */
          if (sel.focusNode.parentNode.parentNode.className == "xmlElementContainer") {
            //var oUltimateParent = this.searchClosestCustomOfXmltag(data, targetPath);
            //var aUltimateCustom = oUltimateParent.reqObj;
            //var jIndex = oUltimateParent.iIndex;

            var restUltimate = aUltimateCustom.splice(jIndex + 1);
            aUltimateCustom.splice(jIndex, 1);
            _.assign(aUltimateCustom, aUltimateCustom.concat(restUltimate));
            _triggerChange();
          }

          /**
           * characterStyleRange handling
           */
          if (sel.focusNode.parentNode.parentNode.className.indexOf("characterContainer") > (-1)) {
            //var oCharacterOfParent = this.searchClosestCustomOfChara(data, parentUID);
            var aCustom = aUltimateCustom;
            var charIndex =  jIndex;
            /**
             * if aCustom is having more than 1 child elements i.e. more than one characterStyleRanges.
             */
            if (aCustom.length > 1) {
              /**
               * if next charaStyle and previous charaStyle are same, then remove current node and combine
               */
              if (aCustom[charIndex + 1] && aCustom[charIndex - 1] &&
                  (aCustom[charIndex - 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle == aCustom[charIndex + 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle)) {
                /**
                 * if next nodes are present ,then store it to rest to append.
                 */
                if (aCustom[charIndex + 2]){
                  var restArray = aCustom.splice(charIndex + 2);
                }

                var last = aCustom[charIndex - 1].CharacterStyleRange[0].Custom.length - 1;
                /**
                 * if pre charaStyle has last node as CONTENT and next charaStyle has its first element as CONTENT, then merge these two CONTENTS
                 */
                if (aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content
                    && aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content)
                {
                  aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"] =
                        aCustom[charIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"]
                      + aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"];

                  aCustom[charIndex + 1].CharacterStyleRange[0].Custom.splice(0, 1);
                }

                /**
                 * if next charaStyle has more nodes then append remaining nodes to pre charaStyle.
                 */
                if (aCustom[charIndex + 1].CharacterStyleRange[0].Custom.length > 0) {
                  aCustom[charIndex - 1].CharacterStyleRange[0].Custom =
                      aCustom[charIndex - 1].CharacterStyleRange[0].Custom.concat(aCustom[charIndex + 1].CharacterStyleRange[0].Custom);
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
      /**
       * for normal backSpace.
       */
      else if(sel.focusOffset >= 1){
        var str = sel.focusNode.data;
        aParent[iIndex].Content[0]["_"] = str.slice(0,sel.focusOffset-1) + str.slice(sel.focusOffset);
        _triggerChange();
        return null;
      }

    },

    handleDeletePressed: function (oEvent, sel, targetPath) {
      /**
       * delete cases...
       * 1)if entire charastyle or xmltagv is ddeleted.----combine twwo contents...after and before waala.
       * 2)if next sibling is br then remove br and check fro before and after charastylesa if same then combine.
       * 3)if
       *
       */
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = this.searchClosestCustomOfContentNBr(currentStory, path);
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var parentUID = returnedObject.parentUID;
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

    handleTabPressed: function (oEvent, sel, uuid) {
      oEvent.preventDefault();
      var tenSpaces = "          ";

      if (sel.focusNode.firstChild && sel.focusNode.firstChild.className.indexOf("br") > (-1)) {
        var oChara = this.selfSearch(data, uuid);
        var newUid2 = utils.generateUUID();
        var newContentObj2 = {"Content": [{"_": tenSpaces, "$": {"data-uid": newUid2}}]};
        oChara.Custom.splice(0, 0, newContentObj2);
        _triggerChange();
      } else {
        var str = sel.focusNode.data;
        var offset = sel.focusOffset;
        var preText = str.substring(0, offset);
        var postText = str.substring(offset, str.length);
        var oContent = this.selfSearch(data, uuid);
        oContent["_"] = preText + tenSpaces + postText;
        _triggerChange();
      }
    },

    handleOnKeyDown: function (oEvent) {

      if (window.getSelection()) {
        var oSel = window.getSelection();               //o-object, a-array, i-index, s-string.
        var iRange = oSel.getRangeAt(0);

        oCaretPosition.oSelection = oSel;
        oCaretPosition.oRange = iRange.cloneRange();
        oCaretPosition.endOffset = iRange.endOffset;
        oCaretPosition.isEnter = false;

        var iRangeForMultipleEnters = 0;
        var bFromText = false;

        var oCurrentDom;
        if(iRange.commonAncestorContainer.nodeName != "#text"){
          oCurrentDom = iRange.commonAncestorContainer.childNodes[iRange.startOffset];
          oCaretPosition.oNodeToSet = iRange.commonAncestorContainer;
          iRangeForMultipleEnters = iRange.startOffset + 1;
        }
        else{
          oCurrentDom = iRange.commonAncestorContainer.parentNode;
          oCaretPosition.oNodeToSet = iRange.commonAncestorContainer.parentNode;
          iRangeForMultipleEnters  =_.indexOf(oCaretPosition.oNodeToSet.parentNode.childNodes, oCurrentDom) + 1;
          if(iRange.startOffset > 0) {
            iRangeForMultipleEnters += 1;
          }
          bFromText = true;
        }

        var sTargetUID = oCurrentDom.getAttribute("data-uid");
        var sPath = oCurrentDom.getAttribute("data-path");
        sPath = sPath + "/" + sTargetUID;
        _setPathTOUpdate(sPath);


        if (oEvent.keyCode == 13) { //ENTER
          oCaretPosition.isEnter = true;
          if(bFromText) {
            oCaretPosition.oNodeToSet = oCaretPosition.oNodeToSet.parentNode;
          }
          oCaretPosition.endOffset = iRangeForMultipleEnters;
          this.handleEnterKeyPress(oSel, sPath);
        }

        else if (oEvent.keyCode == 8) { //backSpace
          oCaretPosition.endOffset = iRange.endOffset - 1;
          this.handleBackspacePressed(oEvent,oSel, sPath);
        }

        else if (oEvent.keyCode == 46) { // Delete
          this.handleDeletePressed(oEvent, oSel, sPath);
        }

        else if (oEvent.keyCode == 9) {  //Tab
          oCaretPosition.endOffset = iRange.endOffset + 10;
          this.handleTabPressed(oEvent, oSel, sPath);
        }
        else{
          oCaretPosition.endOffset = iRange.endOffset + 1;
          this.handleContentTextChanged(oEvent,oSel,sPath,oCurrentDom);
        }
        _triggerChange();
      }

    }
  }

})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;