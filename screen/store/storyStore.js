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
    focusId: '',
    indexToFocus: 0
  };

  var _triggerChange = function () {
    storyStore.trigger('change');
  };

  var _setPathTOUpdate = function (sPath) {
    sPathToUpdate = sPath;
  };

  var _isCapLockOn = function(e){
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
    if((charKeyCode >= 65 && charKeyCode <= 90 && !shiftKey) || (charKeyCode >= 97 && charKeyCode <= 122 && shiftKey)){
      return true;  // Caps lock is on
    }else{
      return false;  // Caps lock is off.
    }
  };

  var createContentNode = function (sContent){
    return {
      "Content": [
        {
          "_": sContent,
          "$": {"data-uid": utils.generateUUID()}
        }
      ]
    };
  };

  var createBrNode = function (){
    return {
      "Br": [
        {
          "$": {"data-uid": utils.generateUUID()}
        }
      ]
    };
  };

  var updateContentTextWithPushedCharacter = function(oCurrentStory, aPath, sPushedChar, iStartIndex, iSelectionSize){
    var oCustomDetails = _searchClosestCustomOfLastInPath(oCurrentStory, aPath);
    var oContent = oCustomDetails.objectPos[oCustomDetails.indexPos].Content[0];
    oContent["_"] = utils.getSplicedString(oContent['_'],iStartIndex,iSelectionSize,sPushedChar);
    oCaretPosition.focusId = oContent["$"]["data-uid"];
    oCaretPosition.indexToFocus = oContent["_"].length > iStartIndex ? iStartIndex + 1 : oContent["_"].length;
    oCaretPosition.endOffset -= iSelectionSize;
  };

  var handleCharaOfDelete = function(aParent, iIndex){
    /**
     * if next node is BR... then remove that node
     */
    if (aParent[iIndex + 1].Br)
    {
      /**
       * if there are more next siblings to current node, then append next content to current content.
       */
      if (aParent[iIndex] && aParent[iIndex + 1 + 1] && aParent[iIndex + 1 + 1].Content){
        aParent[iIndex].Content[0]["_"] = aParent[iIndex].Content[0]["_"].concat(aParent[iIndex + 2].Content[0]["_"])
        aParent.splice(iIndex + 1 +1, 1);
      }
      aParent.splice(iIndex + 1, 1);
      _triggerChange();
      return null;

    }
    /**
     * if next node is CONTENT, then remove its first character.
     */
    else if(aParent[iIndex + 1].Content){
      var strContent = aParent[iIndex + 1].Content[0]["_"];
      if (strContent.length != 1) {
        aParent[iIndex + 1].Content[0]["_"] = /*str.slice(0, 0) +*/ strContent.slice(1, strContent.length);    //on error fisrt check here.
      } else {
        aParent[iIndex + 1].splice(0, 1);
      }

    }
    /**
     * if next node is XMLElement.
     */
    else if (aParent[iIndex + 1].XMLElement)
    {
      /**
       * if first node of XMLElement is CONTENT.
       */
      if(aParent[iIndex + 1].XMLElement[0].Custom[0].Content)
      {
        var str = aParent[iIndex + 1].XMLElement[0].Custom[0].Content[0]["_"];
        if (str.length != 1) {
          aParent[iIndex + 1].XMLElement[0].Custom[0].Content[0]["_"] = /*str.slice(0, 0) +*/ str.slice(1, str.length);    //on error fisrt check here.
        } else {
          aParent[iIndex + 1].XMLElement[0].Custom.splice(0, 1);
        }
      }
      /**
       * if first node of XMLElement is BR.
       */
      else if (aParent[iIndex + 1].XMLElement[0].Custom[0].Br){
        aParent[iIndex + 1].XMLElement[0].Custom.splice(0, 1);
      }

      _triggerChange();
      return null;
    }

  };

  var handleCharaOfBackSpace = function (aUltimateCustom, jIndex) { //jIndex

    /**  characterStyleRange handling*/
    var aCustom = aUltimateCustom;    //aCustom is a parent of characterStyleRange
    var charIndex = jIndex;

    /**if aCustom is having more than 1 child elements i.e. more than one characterStyleRanges. */
    if (aCustom.length > 1) {

      var lastElementIndex = aCustom[charIndex].CharacterStyleRange[0].Custom.length;
      /**if last element of prev chara is BR*/
      if (aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Br) {

        /** if last Br is NOT the only child*/
        if (lastElementIndex != 1) {
          aCustom[charIndex].CharacterStyleRange[0].Custom.splice(lastElementIndex, 1);
        }
        /** if last Br is the ONLY child*/
        else if (lastElementIndex == 1) {
          /** if aCustom has more than 1 element , i.e. AaCustom has more than one charaStyles*/
          aCustom.splice(charIndex, 1);
        }
      }

      /** if charaStyles node's last element is CONTENT */
      else if (aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Content) {

        var tempStr = aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Content[0]["_"];

        /** if CONTENT string length is greater than 1 */
        if (tempStr.length > 1) {
          tempStr = tempStr.slice(0, tempStr.length - 1);
          aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Content[0]["_"] = tempStr;
        }
        /** if strLength is 1 then remove that node */
        else if (tempStr.length == 1) {
          aCustom[charIndex].CharacterStyleRange[0].Custom.splice(lastElementIndex - 1, 1);
          /** if this CONTENT node was the only node of that charaStyle, then remove that charaStyle also*/
          if (aCustom[charIndex].CharacterStyleRange[0].Custom.length == 0) {
            aCustom.splice(charIndex, 1);
          }
        }
      }

      /** if charaStyles node's last element is XMLElement */
      else if (aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].XMLElement) {
        handleXMLOfBackSpace(aCustom[charIndex].CharacterStyleRange[0].Custom, lastElementIndex - 1);
      }

      _triggerChange();
      return null;
    }
  };

  var handleXMLOfBackSpace = function(aParent, i){
    var lastIndex = aParent[i].XMLElement[0].Custom.length;
    /**if last node is Br.  then remove that node*/
    if(aParent[i].XMLElement[0].Custom[lastIndex-1].Br){
      aParent[i].XMLElement[0].Custom.splice(lastIndex-1, 1);
    }

    /** if last node is Content */
    else if(aParent[i].XMLElement[0].Custom[lastIndex-1].Content){
      var str = aParent[i].XMLElement[0].Custom[lastIndex-1].Content[0]["_"];
      /** if content stringLength is greater than '1'*/
      if (str.length != 1) {
        aParent[iIndex + 1].XMLElement[0].Custom[lastIndex-1].Content[0]["_"] = str.slice(0, str.length-1);
      } else {
        aParent[iIndex + 1].XMLElement[0].Custom.splice(0, 1);
      }
    }

    /** if last node is another characterStyle. Then pass the last node of this character style to CharaHandling Function. */
    else if(aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange){
      var lastOfChara = aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange[0].Custom.length;
      handleCharaOfBackSpace(aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange[0].Custom, lastOfChara-1)
    }

    _triggerChange()
    return null;
  };

  var handleContentTextChangedForCaretSelection = function (targetPath, oCurrentDom, pressedChar, oSelection) {
    var path = targetPath.split("/");
    var currentStoryId = path.splice(0, 1);
    var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];

    var oParentCustom = _searchClosestCustomOfLastInPath(currentStory, path);
    var aCustom = oParentCustom.objectPos;
    var index = oParentCustom.indexPos;
    var uuid = path[path.length - 1];
    /**
     * if key is pressed on any BR node.
     */
    if (oCurrentDom.className.indexOf('br') > (-1)) {
      //var newUid21 = utils.generateUUID();
      var newContentObj21 = createContentNode(pressedChar);
      aCustom.splice(index, 0, newContentObj21);
      oCaretPosition.focusId = newContentObj21.Content[0]["$"]["data-uid"];
      oCaretPosition.indexToFocus = 1;
    }
    /**
     * if a key is pressed either BEFORE or AFTER the BR node...
     */
    else if ((oSelection.focusNode.nextSibling
        && oSelection.focusNode.nextSibling.className.indexOf("br") > (-1))
        ||
        ((oSelection.focusNode.previousSibling
        && oSelection.focusNode.previousSibling.className.indexOf("br") > (-1)))) {

      var newContentStringBefore = oSelection.focusNode.data.substring(0, oSelection.focusOffset) + pressedChar
          + oSelection.focusNode.data.substring(oSelection.focusOffset, oSelection.length);
      var newUid = utils.generateUUID();
      var newContentObj = createContentNode(newContentStringBefore, newUid);
      oCaretPosition.focusId = newContentObj.Content[0]["$"]["data-uid"];
      oCaretPosition.indexToFocus = 1;

      /**
       * if a key is pressed AFTER the BR node...
       */
      if (oSelection.focusNode.previousSibling && oSelection.focusNode.previousSibling.className.indexOf("br") > (-1)) {
        aCustom.splice(index + 1, 0, newContentObj);
      }
      /**
       * * if a key is pressed BEFORE the BR node...
       */
      else if (oSelection.focusNode.nextSibling && oSelection.focusNode.nextSibling.className.indexOf("br") > (-1)) {
        if (index != 0)
          aCustom.splice(index - 1, 0, newContentObj);
        else
          aCustom.splice(index, 0, newContentObj);

        aCustom.splice(-1);
      }
    }
    /**
     * if key is pressed in the middle of the node.(Normal processing)
     */
    else {
      updateContentTextWithPushedCharacter(currentStory, path, pressedChar, oSelection.focusOffset, 0);
    }
  };

  var handleContentTextChangedForRangeSelection = function (oSelection, targetPath, pressedChar) {
    var oSelectionStartNode = oSelection.anchorNode;
    var oSelectionEndNode = oSelection.focusNode;

    if (oSelectionStartNode == oSelectionEndNode) {
      var iSelectionStartPosition = Math.min(oSelection.anchorOffset, oSelection.focusOffset);
      var iSelectionEndPosition = Math.max(oSelection.anchorOffset, oSelection.focusOffset);
      var iSelectionSize = iSelectionEndPosition - iSelectionStartPosition;
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      /**
       * Handling for text content
       */
      if (oSelectionStartNode.nodeName == '#text') {
        updateContentTextWithPushedCharacter(currentStory, path, pressedChar, iSelectionStartPosition, iSelectionSize);
      }
      /**
       * Handling for Br
       */
      else {
        var oCustomDetails = _searchClosestCustomOfLastInPath(currentStory, path);
        var brIndex = oCustomDetails.indexPos;
        /**
         * Handling for removal of br above text content (merge typed string into content)
         */
        if (brIndex < oCustomDetails.objectPos.length - 1
            && oCustomDetails.objectPos[brIndex + 1].Content) {
          var oContent = oCustomDetails.objectPos[brIndex + 1].Content[0];
          oContent["_"] = utils.getSplicedString(oContent['_'], iSelectionStartPosition, 0, pressedChar);
          oCaretPosition.focusId = oContent["$"]["data-uid"];
          oCaretPosition.indexToFocus = iSelectionStartPosition + 1;
          oCaretPosition.endOffset -= iSelectionSize;
          oCustomDetails.objectPos.splice(iSelectionStartPosition, iSelectionSize);
        }
        /**
         * Remove Br and add Content in it's place
         */
        else {
          var oNewContent;
          if(pressedChar != ''){
            oNewContent = createContentNode(pressedChar);
            oCaretPosition.focusId = oNewContent.Content[0]["$"]["data-uid"];
            oCustomDetails.objectPos.splice(iSelectionStartPosition, iSelectionSize, oNewContent);
          } else {
            var oFocusedNode = oCustomDetails.objectPos[brIndex];
            if(oFocusedNode.Content){
              oCaretPosition.focusId = oFocusedNode.Content[0]["$"]["data-uid"];
            } else if (oFocusedNode.Br){
              oCaretPosition.focusId = oFocusedNode.Br[0]["$"]["data-uid"];
            }
            oCustomDetails.objectPos.splice(iSelectionStartPosition, iSelectionSize);
          }
          oCaretPosition.indexToFocus = 0;
          oCaretPosition.endOffset -= iSelectionSize;
        }
      }
    } else {



    }
  };

  var _getLastChildNode = function (oNode) {
    var oCustomLength = 0;
    if(oNode.ParagraphStyleRange) {
      oCustomLength = oNode.ParagraphStyleRange[0].Custom.length;
      return _getLastChildNode(oNode.ParagraphStyleRange[0].Custom[oCustomLength-1]);

    } else if(oNode.CharacterStyleRange) {
      oCustomLength = oNode.CharacterStyleRange[0].Custom.length;
      return _getLastChildNode(oNode.CharacterStyleRange[0].Custom[oCustomLength-1]);

    } else if(oNode.XMLElement) {
      oCustomLength = oNode.XMLElement[0].Custom.length;
      return _getLastChildNode(oNode.XMLElement[0].Custom[oCustomLength-1]);

    } else if (oNode.Content || oNode.Br) {
      return oNode;
    }
  };

  var _getFirstDeepChildNodeFromDOM = function (oDOMNode) {
    if(oDOMNode.firstChild && oDOMNode.firstChild.nodeName != "#text"){
      return _getFirstDeepChildNodeFromDOM(oDOMNode.firstChild);
    }

    return oDOMNode;
  };

  var _searchClosestCustomOfLastInPath = function (obj, remainingPath, sParentId) {
    remainingPath = _.clone(remainingPath);
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
                oClosestCustom = {
                  objectPos: aCustom,
                  indexPos: iCustomIndex,
                  parentUID: sParentId,
                  flag: (sTagKey == 'Br')
                };
              } else {
                remainingPath.splice(0, 1);
                oClosestCustom = _searchClosestCustomOfLastInPath(oTag, remainingPath, oTag['$'][UID_KEY]);
              }
              return false;
            }
          }
        });
        if (oClosestCustom) {
          return false;
        }
      });
      return oClosestCustom;
    }
  };



  var _setCaretPosition = function (aParent, iReturnedObjectIndex, sPath, currentStory) {
    //Set cursor logic
    var oNodeToSetCaret = {};
    var oPreviousNode = aParent[iReturnedObjectIndex - 1];
    if (!_.isEmpty(oPreviousNode)) {
      oNodeToSetCaret = _getLastChildNode(oPreviousNode);

    } else {
      sPath.splice(-1, 1);
      var oSearchedObject = _searchClosestCustomOfLastInPath(currentStory, sPath);
      var oGrandParent = oSearchedObject.objectPos;
      var iIndex = oSearchedObject.indexPos;
      if (iIndex > 0) {
        oNodeToSetCaret = _getLastChildNode(oGrandParent[iIndex - 1]);
      } else {
        _setCaretPosition(oGrandParent, iIndex + 1, sPath, currentStory);
      }
    }

    if(!_.isEmpty(oNodeToSetCaret)) {
      if(oNodeToSetCaret.Content) {
        oCaretPosition.focusId = oNodeToSetCaret.Content[0]["$"]["data-uid"];
        oCaretPosition.indexToFocus = oNodeToSetCaret.Content[0]["_"].length;
      } else if(oNodeToSetCaret.Br){
        oCaretPosition.focusId = oNodeToSetCaret.Br[0]["$"]["data-uid"];
      }
      return null;
    }
  };




  var storyStore =  {

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

    handleContentTextChanged: function (oEvent, oSelection, targetPath,oCurrentDom) {

      var bIsCapsLock = _isCapLockOn(oEvent);
      var pressedChar = String.fromCharCode(oEvent.keyCode);

      if(oEvent.keyCode!=16){ // If the pressed key is anything other than SHIFT
        if(oEvent.keyCode >= 65 && oEvent.keyCode <= 90 ){ // If the key is a letter
          if(oEvent.shiftKey /*|| bIsCapsLock*/ ){ // If the SHIFT/CAPS key is down, return the ASCII code for the capital letter
            pressedChar = String.fromCharCode(oEvent.keyCode);
          }else{ // If the SHIFT key is not down, convert to the ASCII code for the lowecase letter
            pressedChar = String.fromCharCode(oEvent.keyCode + 32);
          }
        }
      }
      if(oSelection.type == 'Caret'){
        handleContentTextChangedForCaretSelection(targetPath, oCurrentDom, pressedChar, oSelection);
      }
      else {
        handleContentTextChangedForRangeSelection(oSelection, targetPath, pressedChar);
      }
      _triggerChange();
    },

    handleEnterKeyPress: function (oCurrentDOM, iStartRange, targetPath) {
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
      var aContentData = oCurrentDOM.firstChild ? oCurrentDOM.firstChild.data : null;
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var bFlag = returnedObject.flag;
      var iOffset = iStartRange;

      /**
       * true = 'BR' node....if key is down on Br node
       * append directly
       */
      if (bFlag == true) {
        var newBrObj5 = createBrNode();
        aParent.splice(iIndex,0,newBrObj5);
        oCaretPosition.focusId = newBrObj5.Br[0]["$"]["data-uid"];
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
          var newBrObj6 = createBrNode();
          aParent.splice(iIndex, 0, newBrObj6);
          oCaretPosition.focusId = newBrObj6.Br[0]["$"]["data-uid"];
          _triggerChange();
          return null;
        }
        /**
         * if  it is NOT first node of character style or xmlElement
         */
        else {
          var rest = aParent.splice(iIndex + 1);
          aParent.splice(iIndex, 1);

          if(iOffset != 0){
            var newContentStringBefore = aContentData.substring(0, iOffset);
            var newContentObjBefore = createContentNode(newContentStringBefore);
            aParent.push(newContentObjBefore);
          }

          var newBrObj = createBrNode();
          aParent.push(newBrObj);


          /**
           * if cursor is not at the last position of the current content node.
           * then break the string insert one br and append next string
           */
          //if (iOffset < aContentData.length) {
            //var newUid3 = utils.generateUUID();
            var newContentStringAfter = aContentData.substring(iOffset, aContentData.length);
            var newContentObjAfter = createContentNode(newContentStringAfter);
            oCaretPosition.focusId = newContentObjAfter.Content[0]["$"]["data-uid"];
            oCaretPosition.indexToFocus = 0;
            aParent.push(newContentObjAfter);
          //}


          /**
           * if enter is pressed on extreme last position i.e. after last content or br of last Paragraph Node
           * then push one extra br to get cursor on new line.
           */
          /*if (oSel.focusNode.length == oSel.focusOffset
              && oSel.focusNode.parentNode.nextSibling == null
              && oSel.focusNode.parentNode.parentNode.nextSibling == null
              && oSel.focusNode.parentNode.parentNode.parentNode.nextSibling == null ) {
            /!*var newBrObjExtremeLast = createBrNode();
            oCaretPosition.focusId = newBrObjExtremeLast.Br[0]["$"]["data-uid"];*!/
            var newSecondContentObjAfter = createContentNode('');
            oCaretPosition.focusId = newSecondContentObjAfter.Content[0]["$"]["data-uid"];
            oCaretPosition.indexToFocus = 0;
            aParent.push(newSecondContentObjAfter);
          }

          if(rest.Br) {
            oCaretPosition.focusId = rest.Br[0]["$"]["data-uid"];
          }*/
          _.assign(aParent, aParent.concat(rest));
          _triggerChange();
        }


      }
    },

    handleBackspacePressed: function (oEvent, oCurrentDom, iStartIndex, targetPath) {

      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
      var aParent = returnedObject.objectPos;
      var iReturnedObjectIndex = returnedObject.indexPos;

      /**if current node is Br.then remove */
      if(returnedObject.flag == true){
        if(aParent[iReturnedObjectIndex-1]){
          aParent.splice(iReturnedObjectIndex, 1);
        }
        /**
         * go to check current nodes prev charaStyle.
         */
        else if(!aParent[iReturnedObjectIndex-1]){
          var newPath = targetPath.split("/");
          newPath.splice(0,1);
          newPath.splice(-1,1);
          var oReturnedParent = _searchClosestCustomOfLastInPath(currentStory,newPath);
          var aReturnParent = oReturnedParent.objectPos;
          var iParent = oReturnedParent.indexPos;

          if(aReturnParent[iParent-1]){
            var lastOfChara = aReturnParent[iParent-1].Custom.length;
            if(aReturnParent[iParent-1].Custom[lastOfChara-1].Br){
              aReturnParent[iParent-1].Custom.splice(-1,1);
            }
          }
          /**
           * go to check parent nodes of charastyle i.e. for para.
           */
          else if( !aReturnParent[iParent-1]){
            var newPath2 = targetPath.split("/");
            newPath2.splice(0,1);
            newPath2.splice(-1,1);
            newPath2.splice(-1,1);

            var oReturnedGrandParent = _searchClosestCustomOfLastInPath(currentStory, newPath2);
            var aReturnedGrandParent = oReturnedGrandParent.objectPos;
            var iGrandParent = oReturnedGrandParent.indexPos;
            if(aReturnedGrandParent[iGrandParent-1]){
              var lastChara = aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.length;
              //var lastCustomOfChara = aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom[lastChara-1].CharacterStyleRange[0].Custom.length;

              aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom[lastChara-1].CharacterStyleRange[0].Custom.splice(-1,1);
              if(aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom[lastChara-1].CharacterStyleRange[0].Custom.length==0)
              {
                aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.splice(-1,1);
                if(aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.length==0){
                  if(aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.length == 0){
                    aReturnedGrandParent.splice(iGrandParent-1,1);
                  }
                  else if(aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom){
                    _.assign(aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom, aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.concat(aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom));
                    aReturnedGrandParent.splice(iGrandParent,1);
                  }
                }
              }else {
                _.assign(aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom, aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom.concat(aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom));
                aReturnedGrandParent.splice(iGrandParent,1);
              }

            }


          }
        }

        _triggerChange();
        return null;
      }


      /**if current node is not br*/
      /**And its rangeOffSet is '0'*/
      else if (iStartIndex == 0) {
        /**
         * if iIndex th node is not the start node.....then do normal processing
         * i.e. remove the previous node ......remove previous BR and append next content data
         * to previous content data.
         */
        if (iReturnedObjectIndex != 0) {

          /** if previous node is br */
          if (aParent[iReturnedObjectIndex - 1].Br) {
            aParent.splice(iReturnedObjectIndex-1, 1);
            _triggerChange();
            return null;
          }

          /** if prev node is XMLElement*/
          else if (aParent[iReturnedObjectIndex - 1].XMLElement){
            handleXMLOfBackSpace(aParent, iReturnedObjectIndex-1);
          }
          /** if prev node is characterSrtleRange*/
          else if(aParent[iReturnedObjectIndex - 1].CharacterStyleRange){
            handleCharaOfBackSpace(aParent, iReturnedObjectIndex-1);
          }

        }
        else if (iReturnedObjectIndex==0){
          /**
           * Paragraph Handling
           */
          if (oCurrentDom.parentNode.className.indexOf("characterContainer") > (-1)) {
            var pathForPara = targetPath.split("/");
            pathForPara.splice(0, 1);
            pathForPara.splice(-1,1);
            pathForPara.splice(-1,1);

            var oReturned = _searchClosestCustomOfLastInPath(currentStory, pathForPara);
            var aCustomPara = oReturned.objectPos;
            var iIndexPara = oReturned.indexPos;

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
      else if (iStartIndex && oCurrentDom.firstChild && oCurrentDom.firstChild.data.length == 1 ) {
        if (aParent.length == 1) {

          var pathForChara=targetPath.split('/');
          pathForChara.splice(0,1);
          pathForChara.splice(-1,1);
          var oUltimateParent = _searchClosestCustomOfLastInPath(currentStory, pathForChara);
          var aUltimateCustom = oUltimateParent.objectPos;
          var jIndex = oUltimateParent.indexPos;
          /**
           * xml tag :either you can totally remove or normal processing. We can't combine xml tags.
           */
          if (oCurrentDom.parentNode.className == "xmlElementContainer") {


            var restUltimate = aUltimateCustom.splice(jIndex + 1);
            aUltimateCustom.splice(jIndex, 1);
            _.assign(aUltimateCustom, aUltimateCustom.concat(restUltimate));
            _triggerChange();
          }

          /**
           * characterStyleRange handling
           */
          if (oCurrentDom.parentNode.className.indexOf("characterContainer") > (-1)) {
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
              }
              /** if next and prev styles are  not same*/
              else if(aCustom[charIndex + 1] && aCustom[charIndex - 1] &&
                  (aCustom[charIndex - 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle != aCustom[charIndex + 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle))
              {
                aCustom.splice(charIndex, 1);
                _triggerChange();
              }
              else if (charIndex == (aCustom.length - 1) || charIndex == 0) {
                aCustom.splice(charIndex, 1);
                _triggerChange();
              }
            }
            /**
             * if its the only present charaStyle, then remove its parent also...i.e. remove that paraStyle
             */
            else if(aCustom.length == 1){
              var pathForPara2=targetPath.split('/');
              pathForPara2.splice(0,1);
              pathForPara2.splice(-1,1);
              var oUltimateParentForPara = _searchClosestCustomOfLastInPath(currentStory, pathForPara2);
              var aUltimateCustomForPara = oUltimateParentForPara.objectPos;
              var jIndexForPara = oUltimateParentForPara.indexPos;
              aUltimateCustomForPara.splice(jIndexForPara,1);
              _triggerChange();
            }
          }

        }
        else if (aParent.length > 1) {
          /**
           * delete only current node and append all other remaining to previous.
           */
          if ((iReturnedObjectIndex + 1) != aParent.length) {
            var afterNodes = aParent.splice(iReturnedObjectIndex + 1);
          }

          var aPath = targetPath.split('/');
          aPath.splice(0,1);
          _setCaretPosition(aParent, iReturnedObjectIndex, aPath, currentStory);

          aParent.splice(iReturnedObjectIndex, 1);

          if (afterNodes) {
            _.assign(aParent, aParent.concat(afterNodes));
          }
          _triggerChange();
        }
      }
      /**
       * for normal backSpace.
       */
      else if(iStartIndex >= 1){
        var str = oCurrentDom.firstChild.data;
        aParent[iReturnedObjectIndex].Content[0]["_"] = str.slice(0, iStartIndex - 1) + str.slice(iStartIndex);
        oCaretPosition.focusId = aParent[iReturnedObjectIndex].Content[0]["$"]["data-uid"];
        oCaretPosition.indexToFocus = iStartIndex - 1;
        _triggerChange();
        return null;
      }

    },

    handleTabPressed: function (oEvent, sel, targetPath) {
      var tenSpaces = "          ";
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var oReturnedObject = {};

      if(sel.focusNode) {
        var sClassNames = sel.focusNode.className;
        if(_.includes(sClassNames, "content") || _.includes(sel.focusNode.nodeName, "#text")) {
          var str = sel.focusNode.data;
          if(_.includes(sClassNames, "content")) {
            str = sel.focusNode.firstChild.data;
          }
          var offset = sel.focusOffset;
          var preText = str.substring(0, offset);
          var postText = str.substring(offset, str.length);
          oReturnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
          if(!_.isEmpty(oReturnedObject)) {
            oReturnedObject.objectPos[oReturnedObject.indexPos].Content[0]["_"] = preText + tenSpaces + postText;
            oCaretPosition.focusId = oReturnedObject.objectPos[oReturnedObject.indexPos].Content[0]["$"]["data-uid"];
            oCaretPosition.indexToFocus = preText.length + 10;
          }

        } else {

          oReturnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
          var newContentObj2 = createContentNode(tenSpaces);
          oCaretPosition.focusId = newContentObj2.Content[0]["$"]["data-uid"];
          oCaretPosition.indexToFocus = 10;
          if(!_.isEmpty(oReturnedObject)) {
            if((oReturnedObject.objectPos.length - 1) == oReturnedObject.indexPos){
              oReturnedObject.objectPos.splice(oReturnedObject.indexPos, 1, newContentObj2);
            } else {
              oReturnedObject.objectPos.splice(oReturnedObject.indexPos, 0, newContentObj2);
            }
          }
        }
      }

      _triggerChange();
    },

    handleDeletePressed: function (oEvent, sel, targetPath) {
      var path = targetPath.split("/");
      var currentStoryId = path.splice(0, 1);
      var currentStory = data[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;


      /**
       * if key is pressed on BR node
       */
      if(returnedObject.flag==true){
        aParent.splice(iIndex,1);
        _triggerChange();
        return null;
      }



      /**
       * if key is pressed on the last position of the current node
       */
      if (sel.focusOffset == aParent[iIndex].Content[0]["_"].length)
      {
        /**
         * if current node has next node. (Current node will always be CONTENT)
         */
        if (aParent[iIndex + 1])
        {
          handleCharaOfDelete(aParent, iIndex);
        }
        /**
         * if current node is the last node of its parent , i.e. it is the last node of current characterStyle.
         */
        else if (iIndex == aParent.length - 1) {

          var pathForChara = targetPath.split("/");
          pathForChara.splice(0,1);
          pathForChara.splice(-1,1);
          var oParentOfCharacter = _searchClosestCustomOfLastInPath(currentStory,pathForChara);
          var aCustom = oParentOfCharacter.objectPos;
          var charIndex = oParentOfCharacter.indexPos;

          /**
           * if current node has next characterStyle
           */
          if (aCustom[charIndex + 1]) {
            handleCharaOfDelete(aCustom[charIndex + 1].CharacterStyleRange[0].Custom, -1);

          }else if(!aCustom[iIndex+1]){
            //handleParaOfDelete()
          }
        }
      }
      else if (sel.focusOffset < aParent[iIndex].Content[0]["_"].length){
        var strContent = aParent[iIndex].Content[0]["_"];
        if (strContent.length != 1) {
          aParent[iIndex].Content[0]["_"] = strContent.slice(0, sel.focusOffset) + strContent.slice(sel.focusOffset+1, strContent.length);    //on error fisrt check here.
        } else {
          aParent[iIndex].splice(0, 1);
        }
        _triggerChange();
      }
    },



    handleOnKeyDown: function (oEvent) {

      if (window.getSelection()) {
        //Keys not to prevent default
        if(
         /*Arrow Keys, HOME and END*/  (oEvent.keyCode >= 35 && oEvent.keyCode <= 40) ||
        /*Function Keys*/               (oEvent.keyCode >= 112 && oEvent.keyCode <= 123) ||
        /*SHIFT Key*/                   oEvent.keyCode == 16 || oEvent.metaKey || oEvent.ctrlKey)

        {
          return;
        }

        oEvent.preventDefault();

        var oSel = window.getSelection();               //o-object, a-array, i-index, s-string.
        var oRange = oSel.getRangeAt(0);
        var iStartRange = 0;

        var oCurrentDom;
        if(oRange.startContainer.nodeName == "#text" || _.includes(oRange.startContainer.classList, "content")) {
          if(_.includes(oRange.startContainer.classList, "content")) {
            oCurrentDom = oRange.startContainer;
          } else {
            oCurrentDom = oRange.startContainer.parentNode;
          }
          iStartRange = oRange.startOffset;
        } else {
          oCurrentDom = oRange.commonAncestorContainer.childNodes[oRange.startOffset];
          iStartRange = 0;
          if(!(_.includes(oCurrentDom.classList, "Br") || _.includes(oCurrentDom.classList, "Content"))) {
            oCurrentDom = _getFirstDeepChildNodeFromDOM(oCurrentDom);
          }
        }

/*        if(oSel.focusNode.nodeName != "#text" ){
          oCurrentDom = oRange.commonAncestorContainer.childNodes[oRange.startOffset];
        }
        else{
          oCurrentDom = oRange.commonAncestorContainer.parentNode;
        }*/

        var sTargetUID = oCurrentDom.getAttribute("data-uid");
        var sPath = oCurrentDom.getAttribute("data-path");
        sPath = sPath + "/" + sTargetUID;
        _setPathTOUpdate(sPath);


        if (oEvent.keyCode == 13) { //ENTER
          this.handleEnterKeyPress(oCurrentDom, iStartRange, sPath);
        }

        else if (oEvent.keyCode == 8) { //backSpace
          this.handleBackspacePressed(oEvent,oCurrentDom, iStartRange, sPath);
        }

        else if (oEvent.keyCode == 46) { // Delete
          this.handleDeletePressed(oEvent, oSel, sPath);
        }

        else if (oEvent.keyCode == 9) {  //Tab
          this.handleTabPressed(oEvent, oSel, sPath);
        }
        else{
          this.handleContentTextChanged(oEvent,oSel,sPath,oCurrentDom);
        }
        _triggerChange();
      }
      //document.querySelector('[data-abc]')
    }
  };

  return storyStore;

})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;