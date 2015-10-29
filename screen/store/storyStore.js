/*var fs = require('fs');
 var xmldom = require('xmldom').DOMParser;
 var xpath = require('xpath');*/
var $ = require('jquery');
var _ = require('lodash');

var MicroEvent = require('../../libraries/microEvent/MicroEvent');
var utils = require('../store/utils');

var UID_KEY = 'data-uid';

var storyStore = (function () {

  var oStoryData = {};

  var oStyleData = {};

  var oImageData = {};

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


  var _createXMLElement = function (sSelf, sMarkupTag, sXMLContent, aCustom) {
    return {
      "XMLElement": [
        {
          "Custom": aCustom ? aCustom : [],
          "$": {
            "data-uid": utils.generateUUID(),
            "Self": sSelf,
            "MarkupTag": sMarkupTag,
            "XMLContent": sXMLContent
          }
        }
      ]
    };
  };

  var _createParagraphStyleRange = function (sStyleId, aCustom) {
    return {
      "ParagraphStyleRange": [
        {
          "Custom": aCustom ? aCustom : [],
          "$": {
            "data-uid": utils.generateUUID(),
            "AppliedParagraphStyle": sStyleId
          }
        }
      ]
    };
  };

  var _createCharacterStyleRange = function (sStyleId, aCustom) {
    return {
      "CharacterStyleRange": [
        {
          "Custom": aCustom ? aCustom : [],
          "$": {
            "data-uid": utils.generateUUID(),
            "AppliedCharacterStyle": sStyleId
          }
        }
      ]
    };
  };

  var _createContentNode = function (sContent){
    return {
      "Content": [
        {
          "_": sContent,
          "$": {"data-uid": utils.generateUUID()}
        }
      ]
    };
  };

  var _createBrNode = function (){
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
  };

  var _handlePrevGrandParent = function(aGrandParent, iGrandIndex){
    if(aGrandParent[iGrandIndex-1] ){

      if(aGrandParent[iGrandIndex-1].XMLElement && aGrandParent[iGrandIndex-1].XMLElement[0].Custom.length == 0){
        //_handleCaretIfNotOnlyChildDelete(aParent, iIndex );
        _handlePrevGrandParent(aGrandParent, iGrandIndex-1)
      }

      else{
        var oLastNodeofPrev = _getLastChildNode(aGrandParent[iGrandIndex-1]);
        var focusID;
        if(oLastNodeofPrev.Content){
          focusID = oLastNodeofPrev.Content[0]['$']['data-uid'];
          var focusOffset = oLastNodeofPrev.Content[0]['_'].length;
          _setCaretPositionAccordingToObjectDelete(focusID, focusOffset);
        }else if(oLastNodeofPrev.Br){
          focusID = oLastNodeofPrev.Br[0]['$']['data-uid'];
          _setCaretPositionAccordingToObjectDelete(focusID);
        }
      }
    }else {
      console.log("hi hi haa haa haaaaaaaa");
    }
  };


  var handleCharaOfDelete = function(aParent, iIndex, aGrandParent, iGrandIndex, iRange){

    /** if next node is BR... then remove that node */
    if (aParent[iIndex].Br)
    {
      /**if there are more next siblings to current node, then append next content to current content.  */
      if (aParent[iIndex-1] && aParent[iIndex + 1] && aParent[iIndex + 1].Content){
        var tempStr = "";

        /** handle caret for Br* ....special case*/
        if(aParent[iIndex-1].Content){
          var focusID5 = aParent[iIndex-1].Content[0]['$']['data-uid'];
          var focusOffset5 = aParent[iIndex-1].Content[0]['_'].length;
          _setCaretPositionAccordingToObjectDelete(focusID5, focusOffset5);
          //return ;
        }

        /** to handle empty ContentNode*/
        if(aParent[iIndex + 1].Content[0]["_"].length == 0){
          if(aParent[iIndex + 2] && aParent[iIndex + 2].Content){
            tempStr = aParent[iIndex + 2].Content[0]["_"];
          }
          aParent.splice(iIndex + 1 , 1);
        }
        else{
          tempStr = aParent[iIndex + 1].Content[0]["_"];
        }
        aParent[iIndex-1].Content[0]["_"] = aParent[iIndex-1].Content[0]["_"].concat(tempStr);
        aParent.splice(iIndex + 1 , 1);
      }
      aParent.splice(iIndex, 1);
    }

    /** if next node is CONTENT, then remove its first character.*/
    else if(aParent[iIndex].Content)
    {
      var strContent = aParent[iIndex].Content[0]["_"];
      if (strContent.length > 1) {
        if(!iRange){
          aParent[iIndex].Content[0]["_"] = strContent.slice(1, strContent.length);
        }
        else if(iRange && iRange.startContainer.nodeName == "#text"){
          var focusID3 = aParent[iIndex].Content[0]['$']['data-uid'];
          var focusOffset3 = iRange.endOffset;
          _setCaretPositionAccordingToObjectDelete(focusID3, focusOffset3);
          aParent[iIndex].Content[0]["_"] = strContent.slice(0, iRange.endOffset) + strContent.slice(iRange.endOffset+1, strContent.length);
        }

      } else {

        aParent.splice(iIndex, 1);

        if(aParent.length == 0 && aGrandParent){

          if(!aGrandParent[iGrandIndex].XMLElement){
            aGrandParent.splice(iGrandIndex,1);
            /** if prev and next charaStyle are same then append both*/
            if(aGrandParent[iGrandIndex-1] && aGrandParent[iGrandIndex-1].CharacterStyleRange
              && aGrandParent[iGrandIndex] && aGrandParent[iGrandIndex].CharacterStyleRange &&
                aGrandParent[iGrandIndex-1].CharacterStyleRange[0]['$'].AppliedCharacterStyle
                == aGrandParent[iGrandIndex].CharacterStyleRange[0]['$'].AppliedCharacterStyle)    //  //NOw iGrandIndex is reduced
            {


              var lastOfCustom = aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom.length;
              var preContentStr = aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom[lastOfCustom-1].Content[0]['_'];

              var focusID4 = aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom[lastOfCustom-1].Content[0]['$']['data-uid'];
              var focusOffset4 = preContentStr.length;


              if(aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom[lastOfCustom-1].Content
                  && aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom[0].Content){
                var postContentStr = aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom[0].Content[0]['_'];
                aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom[lastOfCustom-1].Content[0]['_'] = preContentStr + postContentStr;

                aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom.splice(0,1);
                _.assign(aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom, aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom.concat(aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom));
              }
              else{
                _.assign(aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom, aGrandParent[iGrandIndex-1].CharacterStyleRange[0].Custom.concat(aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom));
              }

              _setCaretPositionAccordingToObjectDelete(focusID4, focusOffset4);
              aGrandParent.splice(iGrandIndex, 1);
            }
            else{
              if(aGrandParent[iGrandIndex]){
                _handleCaretIfNotOnlyChildDelete(aGrandParent, iGrandIndex);
              }
            }

          }else if(aGrandParent[iGrandIndex].XMLElement){

            if(aGrandParent[iGrandIndex+1]){
              _handleCaretIfNotOnlyChildDelete(aGrandParent, iGrandIndex+1);
            }
          }

        }
        else if(aParent.length != 0 && aParent[iIndex]){
          if(!aParent[iIndex].Br){
            _handleCaretIfNotOnlyChildDelete(aParent, iIndex );
          }else{

            _handlePrevGrandParent(aGrandParent, iGrandIndex);

            /*if(aGrandParent[iGrandIndex-1] ){

              if(aGrandParent[iGrandIndex-1].XMLElement && aGrandParent[iGrandIndex-1].XMLElement[0].Custom.length == 0){
                _handleCaretIfNotOnlyChildDelete(aParent, iIndex );
              }
              else{
                var oLastNodeofPrev = _getLastChildNode(aGrandParent[iGrandIndex-1]);
                var focusID;
                if(oLastNodeofPrev.Content){
                  focusID = oLastNodeofPrev.Content[0]['$']['data-uid'];
                  var focusOffset = oLastNodeofPrev.Content[0]['_'].length;
                  _setCaretPositionAccordingToObjectDelete(focusID, focusOffset);
                }else if(oLastNodeofPrev.Br){
                  focusID = oLastNodeofPrev.Br[0]['$']['data-uid'];
                  _setCaretPositionAccordingToObjectDelete(focusID);
                }
              }


            }*/

          }

        }
      }
    }

    /**if next node is XMLElement.  */
    else if (aParent[iIndex].XMLElement)
    {

      if(aParent[iIndex].XMLElement[0].Custom.length!=0){
        /** if first node of XMLElement is CONTENT.   */
        if(aParent[iIndex].XMLElement[0].Custom[0].Content){
          var str = aParent[iIndex].XMLElement[0].Custom[0].Content[0]["_"];
          if (str.length != 1) {
            aParent[iIndex].XMLElement[0].Custom[0].Content[0]["_"] = str.slice(1, str.length);
          } else {
            aParent[iIndex].XMLElement[0].Custom.splice(0, 1);
          }
        }
        /** if first node of XMLElement is BR.   */
        else if (aParent[iIndex].XMLElement[0].Custom[0].Br){
          aParent[iIndex].XMLElement[0].Custom.splice(0, 1);
        }
        /** if first node of XMLElement is CharaStyle */
        else if(aParent[iIndex].XMLElement[0].Custom[0].CharacterStyleRange){
          handleCharaOfDelete(aParent[iIndex].XMLElement[0].Custom[0].CharacterStyleRange[0].Custom, 0, aParent[iIndex].XMLElement[0].Custom, 0);
        }
      }else {
        if(aParent[iIndex+1]){
          handleCharaOfDelete(aParent, iIndex+1, aGrandParent, iGrandIndex );
        }else if(! aParent[iIndex + 1] && aGrandParent[iGrandIndex+1] ){
          handleCharaOfDelete( aGrandParent, iGrandIndex+1 );
        }

      }

    }

    /** if next node is characterStyleRange */
    else if(aParent[iIndex].CharacterStyleRange){
      handleCharaOfDelete(aParent[iIndex].CharacterStyleRange[0].Custom, 0, aParent, iIndex);
    }

  };


  var handleCharaOfBackSpace = function (aCustom, charIndex) { //jIndex

    /**  characterStyleRange handling*/
    /**if aCustom is having more than 1 child elements i.e. more than one characterStyleRanges. */
    if (aCustom.length > 1) {

      var lastElementIndex = aCustom[charIndex].CharacterStyleRange[0].Custom.length;
      /**if last element of prev chara is BR*/
      if (aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Br) {

        /** if last Br is NOT the only child*/
        if (lastElementIndex != 1) {
          var oNode = _getLastChildNode(aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1]);
          _setCaretPositionAccordingToObject(oNode);
          aCustom[charIndex].CharacterStyleRange[0].Custom.splice(lastElementIndex, 1);
        }
        /** if last Br is the ONLY child*/
        else if (lastElementIndex == 1) {
          /** if aCustom has more than 1 element , i.e. AaCustom has more than one charaStyles*/
          oNode = _getLastChildNode(aCustom[charIndex - 1]);
          _setCaretPositionAccordingToObject(oNode);
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
          oCaretPosition.focusId = aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].Content[0]["$"]["data-uid"];
          oCaretPosition.indexToFocus = tempStr.length;
        }
        /** if strLength is 1 then remove that node */
        else if (tempStr.length == 1) {
          aCustom[charIndex].CharacterStyleRange[0].Custom.splice(lastElementIndex - 1, 1);
          /** if this CONTENT node was the only node of that charaStyle, then remove that charaStyle also*/
          if (aCustom[charIndex].CharacterStyleRange[0].Custom.length == 0) {

            oNode = _getLastChildNode(aCustom[charIndex - 1]);
            _setCaretPositionAccordingToObject(oNode);

            aCustom.splice(charIndex, 1);
          }
        }
      }

      /** if charaStyles node's last element is XMLElement */
      else if (aCustom[charIndex].CharacterStyleRange[0].Custom[lastElementIndex - 1].XMLElement) {
        handleXMLOfBackSpace(aCustom[charIndex].CharacterStyleRange[0].Custom, lastElementIndex - 1);
      }
    }
  };

  var handleXMLOfBackSpace = function(aParent, i, aChild, iChild){
    var lastIndex = aParent[i].XMLElement[0].Custom.length;

    /**if last node is Br.  then remove that node*/
    if(aParent[i].XMLElement[0].Custom[lastIndex-1].Br){
      var oNode = aParent[i].XMLElement[0].Custom[lastIndex-2];
      if(oNode) {
        oNode = _getLastChildNode(oNode);
        _setCaretPositionAccordingToObject(oNode);
      }
      aParent[i].XMLElement[0].Custom.splice(lastIndex-1, 1);
    }

    /** if last node is Content */
    else if(aParent[i].XMLElement[0].Custom[lastIndex-1].Content){
      var str = aParent[i].XMLElement[0].Custom[lastIndex-1].Content[0]["_"];
      /** if content stringLength is greater than '1'*/
      if (str.length != 1) {
        aParent[i].XMLElement[0].Custom[lastIndex-1].Content[0]["_"] = str.slice(0, str.length-1);
        oCaretPosition.focusId = aParent[i].XMLElement[0].Custom[lastIndex-1].Content[0]["$"]["data-uid"];
        oCaretPosition.indexToFocus = aParent[i].XMLElement[0].Custom[lastIndex-1].Content[0]["_"].length;
      } else {
        aParent[i].XMLElement[0].Custom.splice(0, 1);
        oNode = _getLastChildNode(aParent[i].XMLElement[0].Custom[0]);
        _setCaretPositionAccordingToObject(oNode);
      }
    }

    /** if last node is another characterStyle. Then pass the last node of this character style to CharaHandling Function. */
    else if(aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange){
      var lastOfChara = aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange[0].Custom.length;
      handleCharaOfBackSpace(aParent[i].XMLElement[0].Custom[lastIndex-1].CharacterStyleRange[0].Custom, lastOfChara-1)
    }

   /* _triggerChange();
    return null;*/
  };

  var handleContentTextChangedForCaretSelection = function (targetPath, oCurrentDom, pressedChar, oSelection) {
    var path = targetPath.split("/");
    var currentStoryId = path.splice(0, 1);
    var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];

    var oParentCustom = _searchClosestCustomOfLastInPath(currentStory, path);
    var aCustom = oParentCustom.objectPos;
    var index = oParentCustom.indexPos;
    var uuid = path[path.length - 1];
    /**
     * if key is pressed on any BR node.
     */
    if (oCurrentDom.className.indexOf('br') > (-1)) {
      //var newUid21 = utils.generateUUID();
      var newContentObj21 = _createContentNode(pressedChar);
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
      var newContentObj = _createContentNode(newContentStringBefore, newUid);
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
      var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];
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
          oCustomDetails.objectPos.splice(iSelectionStartPosition, iSelectionSize);
        }
        /**
         * Remove Br and add Content in it's place
         */
        else {
          var oNewContent;
          if(pressedChar != ''){
            oNewContent = _createContentNode(pressedChar);
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
        }
      }
    } else {



    }
  };

  var _handleCaretIfNotOnlyChildDelete = function(aGrandparent, iGrandparent){

    if(aGrandparent[iGrandparent].Content){
      var focusIdContent = aGrandparent[iGrandparent].Content[0]['$']['data-uid'];
      var focusOffset = 0;
      _setCaretPositionAccordingToObjectDelete(focusIdContent, focusOffset);
    }
    else if(aGrandparent[iGrandparent].Br){
      var focusIdBr = aGrandparent[iGrandparent].Br[0]['$']['data-uid'];
      _setCaretPositionAccordingToObjectDelete(focusIdBr);
    }
    else {
      if(aGrandparent[iGrandparent].ParagraphStyleRange){
        var aParent1 = aGrandparent[iGrandparent].ParagraphStyleRange[0].Custom;
        var iIndex1 = 0;
        _handleCaretIfNotOnlyChildDelete(aParent1, iIndex1);
      }
      else if(aGrandparent[iGrandparent].CharacterStyleRange){
        var aParent2 = aGrandparent[iGrandparent].CharacterStyleRange[0].Custom;
        var iIndex2 = 0;
        _handleCaretIfNotOnlyChildDelete(aParent2, iIndex2);
      }
      else if(aGrandparent[iGrandparent].XMLElement){
        var aParent3 = aGrandparent[iGrandparent].XMLElement[0].Custom;
        var iIndex3 = 0;
        _handleCaretIfNotOnlyChildDelete(aParent3, iIndex3);
      }
    }

  };

  var _ifOnlyChildDelete = function(currentStory, path){

    path.splice(-1, 1);

    var oGrandparent = _searchClosestCustomOfLastInPath(currentStory, path);
    var aGrandparent = oGrandparent.objectPos;
    var iGrandparent = oGrandparent.indexPos;

    if(aGrandparent[iGrandparent].ParagraphStyleRange && aGrandparent.length == 1){
      return ;
    }

    if(aGrandparent[iGrandparent].XMLElement){
      return ;
    }

    aGrandparent.splice(iGrandparent, 1);

    if (aGrandparent.length == 0) {
      _ifOnlyChildDelete(currentStory, aGrandparent, path);
    }else{
      if(aGrandparent[iGrandparent]){
        _handleCaretIfNotOnlyChildDelete(aGrandparent, iGrandparent);
      }
    }
  };

  var _ifNoNextNOde = function(currentStory, pathForChara){
    pathForChara.splice(-1,1);
    var oParentOfCharacter = _searchClosestCustomOfLastInPath(currentStory,pathForChara);
    var aCustom = oParentOfCharacter.objectPos;
    var charIndex = oParentOfCharacter.indexPos;

    /** if parent node has next node */
    if (aCustom[charIndex + 1]) {
      if(aCustom[charIndex + 1].CharacterStyleRange){
        handleCharaOfDelete(aCustom[charIndex + 1].CharacterStyleRange[0].Custom, 0);
      }
      else if(aCustom[charIndex + 1].XMLElement){
         //TODO: /** handleXMLofDelete();*/
      }
    }
    /** if this is the last CharacterStyle*/
    else if(!aCustom[charIndex+1]){
      _ifNoNextNOde(currentStory, pathForChara);
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

  var _getLastDeepChildNodeFromDOM = function (oDOMNode) {
    if(oDOMNode.lastChild && oDOMNode.lastChild.nodeName != "#text"){
      return _getLastDeepChildNodeFromDOM(oDOMNode.lastChild);
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

  var _setCaretPosition = function (aParent, iReturnedObjectIndex, aPath, currentStory) {
    //Set cursor logic
    var oNodeToSetCaret = {};
    var oPreviousNode = aParent[iReturnedObjectIndex - 1];
    if (!_.isEmpty(oPreviousNode)) {
      oNodeToSetCaret = _getLastChildNode(oPreviousNode);
      _setCaretPositionAccordingToObject(oNodeToSetCaret);

    } else {
      aPath.splice(-1, 1);
      var oSearchedObject = _searchClosestCustomOfLastInPath(currentStory, aPath);
      var oGrandParent = oSearchedObject.objectPos;
      var iIndex = oSearchedObject.indexPos;
      if (iIndex > 0) {
        oNodeToSetCaret = _getLastChildNode(oGrandParent[iIndex - 1]);
        _setCaretPositionAccordingToObject(oNodeToSetCaret);

      } else {
        _setCaretPosition(oGrandParent, iIndex + 1, aPath, currentStory);
      }
    }
  };

  var _setCaretPositionAccordingToObject = function (oNodeToSetCaret, iCaretPosition) {
    if(!_.isEmpty(oNodeToSetCaret)) {
      if(oNodeToSetCaret.Content) {
        oCaretPosition.focusId = oNodeToSetCaret.Content[0]["$"]["data-uid"];
        if(iCaretPosition == undefined) {
          oCaretPosition.indexToFocus = oNodeToSetCaret.Content[0]["_"].length;
        } else {
          oCaretPosition.indexToFocus = iCaretPosition;
        }
      } else if(oNodeToSetCaret.Br){
        oCaretPosition.focusId = oNodeToSetCaret.Br[0]["$"]["data-uid"];
      }
    }
  };


  var _setCaretPositionAccordingToObjectDelete = function (focusId, indexToFocus) {
    oCaretPosition.focusId = focusId;
    if (indexToFocus >= 0) {
      oCaretPosition.indexToFocus = indexToFocus;
    }
  };


  var _getFocusObject = function(oNode){
    var retObject = {};
    if(oNode.Content){
      retObject["focusID"] = oNode.Content[0]['$']['data-uid'];
      retObject["focusOffset"] = 0;
      return retObject;
    }
    else if(oNode.Br){
      retObject["focusID"] = oNode.Br[0]['$']['data-uid'];
      return retObject;
    }
    else {
      _getFocusObject(oNode.Custom[0]);
    }

  };


  var _getActualDomNode = function (oDOM, bDeepDOMSearch) {
    var oEvaluatedDOM = oDOM;
    if(oDOM.nodeName == "#text") {
      oEvaluatedDOM = oDOM.parentNode;
    } else if(!(_.includes(oDOM.classList, "content") && _.includes(oDOM.classList, "br")) && bDeepDOMSearch) {
      oEvaluatedDOM = _getFirstDeepChildNodeFromDOM(oDOM);
    }

    return oEvaluatedDOM;
  };

  var _getDomDataInformation = function (oDOM, bDeepDOMSearch) {
    var oEvaluatedDOM = _getActualDomNode(oDOM, bDeepDOMSearch);
    return oEvaluatedDOM.dataset;
  };

  var _getSelectionInformationFromRange = function (oRange) {
    var oStartDOMDataSet = _getDomDataInformation(oRange.startContainer, true);
    var oEndDOMDataSet = _getDomDataInformation(oRange.endContainer, true);
    var oCommonAncestorDataSet = _getDomDataInformation(oRange.commonAncestorContainer, false);

    return {
      startDataSet: oStartDOMDataSet,
      endDataSet: oEndDOMDataSet,
      ancestorDataset: oCommonAncestorDataSet
    }

  };

  var _applyCharacterStyleToSelectedNode = function (sStyleId, oCurrentStory, aStartDOMPath, aEndDOMPath) {

  };


  var _getNextSiblingAcrossParents = function (oDOM) {
    if(_.includes(oDOM.classList, "storyContainer")) {
      return oDOM;
    }
    if(oDOM.nextSibling) {
      return oDOM.nextSibling;
    } else {
      var oParentNode = oDOM.parentNode;
      if(oParentNode.nextSibling) {
        return _getFirstDeepChildNodeFromDOM(oParentNode.nextSibling);
      }

      return _getNextSiblingAcrossParents(oParentNode);
    }
  };

  var _getPreviousSiblingAcrossParents = function (oDOM) {

  };

  var _createPathObject = function (aPath) {
    var oPath = {};
    var oTempPath = {};
    _.forEach(aPath, function (aSinglePath) {
      _.forEach(aSinglePath, function (sPath, iIndex) {
        var oValue = aSinglePath[iIndex + 1] ? _.set({}, aSinglePath[iIndex + 1], {}): {}
        var oObject = oTempPath;

        if(iIndex == 0) {
          oObject = oPath;
        }

        if(!oObject[sPath]) {
          _.set(oObject, sPath, oValue);
        }

        oTempPath = oObject[sPath];
      });
    });
    return oPath;
  };

  var _applyParagraphStyle = function (oCurrentStory, oPath, sStyleId) {

    var aPaths = _.keys(oPath);

    if (oCurrentStory["Custom"]) {
      var aCustom = oCurrentStory["Custom"];
      var aClosestCustom = [];
      _.forEach(aCustom, function (oCustom, iCustomIndex) {
        _.forEach(oCustom, function (oTagObject, sTagKey) {
          if (oTagObject[0]['$']) {
            var oTag = oTagObject[0];
            var sCustomTagUID = oTag['$'][UID_KEY];

            if (_.includes(aPaths, sCustomTagUID)) {

              if(_.isEmpty(oPath[sCustomTagUID])) {
                aClosestCustom.push(oCustom);

              } else {
                var aReturnedObject = _applyParagraphStyle(oTag, oPath[sCustomTagUID], sStyleId);

                if (aReturnedObject) {
                  if (sTagKey == "XMLElement") {

                    var oXMLElement = _createXMLElement(oTagObject[0]['$']["Self"], oTagObject[0]['$']["MarkupTag"], oTagObject[0]['$']["XMLContent"]);
                    oXMLElement.XMLElement[0].Custom = aReturnedObject;
                    aClosestCustom.push(oXMLElement);

                  } else if (sTagKey == "CharacterStyleRange") {

                    var oCharStyle = _createCharacterStyleRange(oTagObject[0]['$']['AppliedCharacterStyle']);
                    oCharStyle.CharacterStyleRange[0].Custom = aReturnedObject;
                    aClosestCustom.push(oCharStyle);

                  } else if ("ParagraphStyleRange") {
                    var oParaStyle = _createParagraphStyleRange(sStyleId);
                    oParaStyle.ParagraphStyleRange[0].Custom = aReturnedObject;
                    aClosestCustom.push(oParaStyle);
                  }
                }
              }
            }
          }
        });
      });
      return aClosestCustom;
    }
  };

  var _getPreviousBrNode = function (oDOMNode) {

    //If Br Node return the current Node
    if (oDOMNode.nodeName.toLowerCase() == "br" || oDOMNode.dataset.storyid) {
      return oDOMNode;
    }

    //If Node have a previous sibling then find br in previous sibling dom
    if(oDOMNode.previousSibling) {
      return _getPreviousBrNode(oDOMNode.previousSibling);

    } else {

      //If no previous sibling found then move to parent start searching from parents previous last child node
      var oParentNode = oDOMNode.parentNode;
      if(oParentNode.previousSibling) {
        return _getPreviousBrNode(_getLastDeepChildNodeFromDOM(oParentNode.previousSibling));
      }

      //If parent also dont have previous then pass it find its parent previous node
      return _getPreviousBrNode(oParentNode);
    }

  };

  var _getNextBrNode = function (oDOMNode) {
    //If Br Node return the current Node
    if (oDOMNode.nodeName.toLowerCase() == "br" || oDOMNode.dataset.storyid) {
      return oDOMNode;
    }

    //If Node have a next sibling then find br in next sibling dom
    if(oDOMNode.nextSibling) {
      return _getNextBrNode(oDOMNode.nextSibling);

    } else {

      //If no next sibling found then move to parent start searching from parents first last child node
      var oParentNode = oDOMNode.parentNode;
      if(oParentNode.nextSibling) {
        return _getNextBrNode(_getFirstDeepChildNodeFromDOM(oParentNode.nextSibling));
      }

      //If parent also dont have next then pass it find its parent next node
      return _getNextBrNode(oParentNode);
    }
  };

  var _getPathOfFirstChildSibling = function (oStartNode, aClonedStartPath) {
    if(oStartNode.dataset.path) {
    }
  };

  var _createPathForRange = function (oStartNode, oEndNode) {
    var aPaths = [];

    while (oStartNode != oEndNode) {
      aPaths.push(oStartNode.dataset.path + "/" + oStartNode.dataset.uid);
      oStartNode = _getNextSiblingAcrossParents(oStartNode);
    }
    aPaths.push(oEndNode.dataset.path + "/" + oEndNode.dataset.uid);

    _.forEach(aPaths, function (sPath, iIndex) {
      var aPathWithoutStory = sPath.split('/');
      aPathWithoutStory.splice(0, 1);
      aPaths[iIndex] = aPathWithoutStory;
    });

    return aPaths;
  };

  var _deleteNodesAccordingToPath = function (oCurrentStory, oPath) {
    var aPaths = _.keys(oPath);
    var bIsContainerEmpty = false;
    if (oCurrentStory["Custom"]) {
      var aCustom = oCurrentStory["Custom"];
      var aClosestCustom = [];
      _.forEach(aCustom, function (oCustom, iCustomIndex) {
        _.forEach(oCustom, function (oTagObject, sTagKey) {
          if (oTagObject[0]['$']) {
            var oTag = oTagObject[0];
            var sCustomTagUID = oTag['$'][UID_KEY];

            if (_.includes(aPaths, sCustomTagUID)) {
              if(_.isEmpty(oPath[sCustomTagUID])) {
                aCustom.splice(iCustomIndex, 1);
                if(aCustom.length == 0) {
                  bIsContainerEmpty = false;
                  return false;
                }
              } else {
                var bContainerEmpty =_deleteNodesAccordingToPath(oTag, oPath[sCustomTagUID]);
                if(bContainerEmpty) {
                  aCustom.splice(iCustomIndex, 1);
                }
              }
            }
          }
        });
      });
    }
    return bIsContainerEmpty;
  };

  var _processApplyingParagraphStyle = function (oRange, oCurrentStory, sStyleId) {
    var oStartDOM = _getDeepestDOM(oRange.startContainer, oRange.startOffset, oRange.commonAncestorContainer).currentDOM;
    var oEndDOM = _getDeepestDOM(oRange.endContainer, oRange.endOffset, oRange.commonAncestorContainer).currentDOM;

    var oPreviousBrNode = _getPreviousBrNode(oStartDOM);
    var oStartNode = _getNextSiblingAcrossParents(oPreviousBrNode);
    var oEndNode = _getNextBrNode(oEndDOM);

    var oStartDataset = oStartNode.dataset;
    var oEndDataset = oEndNode.dataset;

    if(oStartDataset.storyid) {
      //Get First Paragraph
      oStartNode = _getFirstDeepChildNodeFromDOM(oStartNode);
      oStartDataset = oStartNode.dataset;
    }

    if(oEndDataset.storyid) {
      //Get Last Paragraph
      oEndNode = _getLastDeepChildNodeFromDOM(oEndNode);
      oEndDataset = oEndNode.dataset;
    }
    var aPaths = _createPathForRange(oStartNode, oEndNode);
    var oPath = _createPathObject(aPaths);

    var sStartingParagraph = _.keys(oPath)[0];
    var iIndexToInsert = 0;
    _.forEach(oCurrentStory.Custom, function (oObject, iIndex) {
      if(oObject.ParagraphStyleRange) {
        if(oObject.ParagraphStyleRange[0]["$"]["data-uid"] == sStartingParagraph) {
          iIndexToInsert = iIndex;
          return false;
        }
      }
    });

    var aParagraphStyles = _.cloneDeep(_applyParagraphStyle(oCurrentStory, oPath, sStyleId));
    _deleteNodesAccordingToPath(oCurrentStory, oPath);

    var aPostParagraphs = oCurrentStory.Custom.splice(iIndexToInsert + 1);
    oCurrentStory.Custom = oCurrentStory.Custom.concat(aParagraphStyles);
    oCurrentStory.Custom = oCurrentStory.Custom.concat(aPostParagraphs);

  };

  var _applySelectedStyleToSelectedNode = function (oRange, sStyleType, sStyleId) {

    var oDataSet = _getSelectionInformationFromRange(oRange);

    var sAncestorUID = oDataSet.ancestorDataset.uid || oDataSet.ancestorDataset.storyid;
    var aStartDOMPath = oDataSet.startDataSet.path.split('/');
    var aEndDOMPath = oDataSet.endDataSet.path.split('/');

    var aAncestorPath = aStartDOMPath.slice(0, _.indexOf(aStartDOMPath, sAncestorUID) + 1);

    if(oDataSet.ancestorDataset.path) {
      aAncestorPath = oDataSet.ancestorDataset.path.split('/');
      aAncestorPath.push(oDataSet.ancestorDataset.uid);
    }

    aStartDOMPath.splice(0, 1);
    aEndDOMPath.splice(0, 1);

    var oCurrentStory = oStoryData[aAncestorPath[0]]["idPkg:Story"]["Story"][0];

    _setPathTOUpdate(aAncestorPath[0]);

    if(sStyleType == "Character Styles") {
      _applyCharacterStyleToSelectedNode(sStyleId, oCurrentStory, aStartDOMPath, aEndDOMPath);
    } else if (sStyleType == "Paragraph Styles") {
      _processApplyingParagraphStyle(oRange, oCurrentStory, sStyleId);
    }
  };

  var _getDeepestDOM = function (oDOM, iStartOffset, oAncestor) {
    var oCurrentDOM = oDOM;
    var iStartRange = 0;
    if(oDOM.nodeName == "#text" || _.includes(oDOM.classList, "content")) {
      if(_.includes(oDOM.classList, "content")) {
        oCurrentDOM = oDOM;
      } else {
        oCurrentDOM = oDOM.parentNode;
      }
      iStartRange = iStartOffset;
    } else {
      oCurrentDOM = oAncestor.childNodes[iStartOffset];

      if(!oCurrentDOM) {
        oCurrentDOM = oAncestor.lastChild;
      }

      oCurrentDOM = _getFirstDeepChildNodeFromDOM(oCurrentDOM);
      var aDOMClassList = oCurrentDOM.classList;
      if(_.includes(aDOMClassList, "content")) {
        iStartRange = oCurrentDOM.firstChild.data.length;
      } else if(_.includes(aDOMClassList, "br")){
        iStartRange = _.indexOf(oCurrentDOM.parentNode.childNodes, oCurrentDOM);
      }
    }

    return {
      currentDOM: oCurrentDOM,
      startRange: iStartRange
    }
  };

  var storyStore =  {

    setStoreData: function (data1) {
      oStoryData = data1;
    },

    getStoreData: function () {
      return oStoryData;
    },

    getPathToUpdate: function () {
      return sPathToUpdate;
    },

    getCaretPosition: function () {
      return oCaretPosition;
    },

    handleSaveClick: function () {
      $.ajax({
        type: 'POST',
        url: 'onClickSave',
        dataType: 'JSON',
        data: oStoryData/*JSON.stringify(data)*/,
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
      var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];
      var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
      var aContentData = oCurrentDOM.firstChild ? oCurrentDOM.firstChild.data : null;
      var aParent = returnedObject.objectPos;
      var iIndex = returnedObject.indexPos;
      var bFlag = returnedObject.flag;

      /**
       * true = 'BR' node....if key is down on Br node
       * append directly
       */
      if (bFlag == true) {
        var newBrObj5 = _createBrNode();
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
        if (iIndex == 0 && iStartRange == 0 ) {
          var newBrObj6 = _createBrNode();
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
          var newBrObj = _createBrNode();


          if (aContentData == "" || aContentData == null ||
              (aContentData.length == 1 && (aContentData.charCodeAt(0) >= 0 && aContentData.charCodeAt(0) <= 32))) {
            aParent.push(newBrObj);
            aParent.push(rest);0
            _setCaretPositionAccordingToObject(newBrObj);
            _triggerChange();
            return;
          } else if (iStartRange != 0) {
            var newContentStringBefore = aContentData.substring(0, iStartRange);
            var newContentObjBefore = _createContentNode(newContentStringBefore);
            aParent.push(newContentObjBefore);
          }

          aParent.push(newBrObj);


          /**
           * if cursor is not at the last position of the current content node.
           * then break the string insert one br and append next string
           */
          //if (iOffset < aContentData.length) {
            //var newUid3 = utils.generateUUID();
          var newContentStringAfter = aContentData.substring(iStartRange, aContentData.length);
          var newContentObjAfter = _createContentNode(newContentStringAfter);
          _setCaretPositionAccordingToObject(newContentObjAfter, 0);
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

    handleBackspacePressed: function (oEvent, oCurrentDom, iStartIndex, targetPath, oSelection, iRangeOffset) {

      var sType = oSelection.type;

      if(sType == "Caret") {
        var path = targetPath.split("/");
        var currentStoryId = path.splice(0, 1);
        var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];
        var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
        var aParent = returnedObject.objectPos;
        var iParent = returnedObject.indexPos;

        /**if current node is Br.*/
        if (aParent[iParent].Br && returnedObject.flag == true) {
          if (aParent[iParent - 1]) {
            aParent.splice(iParent, 1);
            _setCaretPositionAccordingToObject(aParent[iParent - 1]);
          }

          /** go to check current nodes prev charaStyle. */
          else if (!aParent[iParent - 1]) {
            var newPath = targetPath.split("/");
            newPath.splice(0, 1);
            newPath.splice(-1, 1);
            var oReturnedParent = _searchClosestCustomOfLastInPath(currentStory, newPath);
            var aReturnParent = oReturnedParent.objectPos;
            var iReturnParent = oReturnedParent.indexPos;

            if (aReturnParent[iReturnParent - 1]) {

              if(aReturnParent[iReturnParent - 1].CharacterStyleRange) {
                handleCharaOfBackSpace(aReturnParent, iReturnParent - 1);
              } else if (aReturnParent[iReturnParent - 1].XMLElement) {
                handleXMLOfBackSpace(aReturnParent, iReturnParent - 1);
              } else if (aReturnParent[iReturnParent - 1].Content) {
                _setCaretPositionAccordingToObject(aReturnParent[iReturnParent - 1]);
                aReturnParent.splice(iReturnParent, 1);
              } else if(aReturnParent[iReturnParent - 1].Br) {
                _setCaretPositionAccordingToObject(aReturnParent[iReturnParent - 1]);
                aReturnParent.splice(iReturnParent, 1);
              }

            }

            /** go to check parent nodes of charastyle i.e. for para.*/
            else if (!aReturnParent[iParent - 1]) {
              var newPath2 = targetPath.split("/");
              newPath2.splice(0, 1);
              newPath2.splice(-1, 1);
              newPath2.splice(-1, 1);

              var oReturnedGrandParent = _searchClosestCustomOfLastInPath(currentStory, newPath2);
              var aReturnedGrandParent = oReturnedGrandParent.objectPos;
              var iGrandParent = oReturnedGrandParent.indexPos;
              if (aReturnedGrandParent[iGrandParent - 1]) {
                var lastChara = aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.length;
                //var lastCustomOfChara = aReturnedGrandParent[iGrandParent-1].ParagraphStyleRange[0].Custom[lastChara-1].CharacterStyleRange[0].Custom.length;

                aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom[lastChara - 1].CharacterStyleRange[0].Custom.splice(-1, 1);
                if (aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom[lastChara - 1].CharacterStyleRange[0].Custom.length == 0) {
                  var oPreviousSiblingAcrossGrandParents;
                  aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.splice(-1, 1);
                  if (aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.length == 0) {
                    if (aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.length == 0) {

                      _setCaretPosition(aReturnedGrandParent, iGrandParent - 1, newPath2, currentStory);

                      aReturnedGrandParent.splice(iGrandParent - 1, 1);
                    }
                    else if (aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom) {
                      oPreviousSiblingAcrossGrandParents = _getLastChildNode(aReturnedGrandParent[iGrandParent - 1]);
                      _setCaretPositionAccordingToObject(oPreviousSiblingAcrossGrandParents);

                      /*************Merging Two ParagraphStyleRange **************/
                      _.assign(aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom,
                          aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.concat(
                              aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom
                          )
                      );

                      aReturnedGrandParent.splice(iGrandParent, 1);
                    }
                  }
                } else {
                  oPreviousSiblingAcrossGrandParents = _getLastChildNode(aReturnedGrandParent[iGrandParent - 1]);
                  _setCaretPositionAccordingToObject(oPreviousSiblingAcrossGrandParents);

                  /*************Merging Two ParagraphStyleRange **************/
                  _.assign(aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom,
                      aReturnedGrandParent[iGrandParent - 1].ParagraphStyleRange[0].Custom.concat(
                          aReturnedGrandParent[iGrandParent].ParagraphStyleRange[0].Custom
                      )
                  );

                  aReturnedGrandParent.splice(iGrandParent, 1);
                }

              }


            }
          }
        }

        /**if current node is not br i.e. it is a content node*/
        /**And its rangeOffSet is '0'*/
        else if (iStartIndex == 0 || iRangeOffset ==0) {


          /**
           * if iIndex th node is not the start node.....then do normal processing
           * i.e. remove the previous node ......remove previous BR and append next content data
           * to previous content data.
           */

          if (iParent != 0) {

            /** if previous node is br */
            if (aParent[iParent - 1].Br) {
              var oNode = aParent[iParent - 2];
              if(oNode) {
                oNode = _getLastChildNode(oNode);
                _setCaretPositionAccordingToObject(oNode);
              }

              aParent.splice(iParent - 1, 1);
              //_triggerChange();
              //return null;
            }

            /** if prev node is XMLElement*/
            else if (aParent[iParent - 1].XMLElement) {
              handleXMLOfBackSpace(aParent, iParent - 1);
            }
            /** if prev node is characterSrtleRange*/
            else if (aParent[iParent - 1].CharacterStyleRange) {
              handleCharaOfBackSpace(aParent, iParent - 1);
            }

          }
          else if (iParent == 0 ) {

            /**
             * Paragraph Handling
             */

            if (oCurrentDom.parentNode.className.indexOf("characterContainer") > (-1) ) {
              var pathForPara = targetPath.split("/");
              pathForPara.splice(0, 1);
              pathForPara.splice(-1, 1);
              pathForPara.splice(-1, 1);

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

                var oLastNode = _getLastChildNode(aCustomPara[iIndexPara - 1]);
                _setCaretPositionAccordingToObject(oLastNode);

                aCustomPara.splice(iIndexPara, 1);
                _.assign(aCustomPara, aCustomPara.concat(restPara));
                //_triggerChange();
              }

            }
          }
        }
        /**
         * if there is only one character in the selected node and focusOffset is also 1
         * then remove current node and check, if next and previous node is same or not. If same charaStyle then combine.
         * Check for chara and XML tag.
         */
        else if (iStartIndex && oCurrentDom.firstChild && oCurrentDom.firstChild.data.length == 1) {
          if (aParent.length == 1) {

            var pathForChara = targetPath.split('/');
            pathForChara.splice(0, 1);
            pathForChara.splice(-1, 1);
            var oGrandParent = _searchClosestCustomOfLastInPath(currentStory, pathForChara);
            var aGrandParent = oGrandParent.objectPos;
            var iGrandIndex = oGrandParent.indexPos;

            /** xml tag :either you can totally remove or normal processing. We can't combine xml tags.     */
            if (aGrandParent[iGrandIndex].XMLElement ||  oCurrentDom.parentNode.className == "xmlElementContainer") {
              _setCaretPosition(aGrandParent, iGrandIndex, pathForChara, currentStory);
              aParent.splice(iParent, 1);
            }


            /**             * characterStyleRange handling             */
            if (aGrandParent[iGrandIndex].CharacterStyleRange || oCurrentDom.parentNode.className.indexOf("characterContainer") > (-1)) {

              /**               * if aGrandParent is having more than 1 child elements i.e. more than one characterStyleRanges.               */
              if (aGrandParent.length > 1) {
                /**                 * if next charaStyle and previous charaStyle are same, then remove current node and combine                 */
                if (aGrandParent[iGrandIndex + 1] && aGrandParent[iGrandIndex - 1].CharacterStyleRange
                    && aGrandParent[iGrandIndex - 1] && aGrandParent[iGrandIndex + 1].CharacterStyleRange
                    && (aGrandParent[iGrandIndex - 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle == aGrandParent[iGrandIndex + 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle))
                {
                  /**                   * if next nodes are present ,then store it to rest to append.                   */
                  if (aGrandParent[iGrandIndex + 2])
                  {
                    var restArray = aGrandParent.splice(iGrandIndex + 2);
                  }

                  var last = aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom.length - 1;
                  /** if pre charaStyle has last node as CONTENT and next charaStyle has its first element as CONTENT,
                   *  then merge these two CONTENTS
                   *  */
                  if (aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom[last].Content
                      && aGrandParent[iGrandIndex + 1].CharacterStyleRange[0].Custom[0].Content)
                  {
                    var iContentLength = aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"].length;
                    aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["_"] +=
                         aGrandParent[iGrandIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["_"];

                    aGrandParent[iGrandIndex + 1].CharacterStyleRange[0].Custom.splice(0, 1);

                    oCaretPosition.focusId = aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom[last].Content[0]["$"]["data-uid"];
                    oCaretPosition.indexToFocus = iContentLength;
                  }

                  /** if next charaStyle has more nodes then append remaining nodes to pre charaStyle.     */
                  if (aGrandParent[iGrandIndex + 1].CharacterStyleRange[0].Custom.length > 0) {
                    aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom =
                        aGrandParent[iGrandIndex - 1].CharacterStyleRange[0].Custom.concat(aGrandParent[iGrandIndex + 1].CharacterStyleRange[0].Custom);
                  }

                  aGrandParent.splice(iGrandIndex + 1);
                  aGrandParent.splice(iGrandIndex);

                  if (restArray) {
                    _.assign(aGrandParent, aGrandParent.concat(restArray));
                  }
                }
                /** if next and prev styles are  not same*/
                else if (aGrandParent[iGrandIndex + 1] && aGrandParent[iGrandIndex - 1] &&
                    (aGrandParent[iGrandIndex - 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle != aGrandParent[iGrandIndex + 1].CharacterStyleRange[0]["$"].AppliedCharacterStyle)) {
                  aGrandParent.splice(iGrandIndex, 1);
                  _setCaretPosition(aGrandParent, iGrandIndex, pathForChara, currentStory);
                  //_triggerChange();
                }
                else if (iGrandIndex == (aGrandParent.length - 1) || iGrandIndex == 0) {
                  _setCaretPosition(aGrandParent, iGrandIndex, pathForChara, currentStory);
                  aGrandParent.splice(iGrandIndex, 1);
                  //_triggerChange();
                }
              }
              /**
               * if its the only present charaStyle, then remove its parent also...i.e. remove that paraStyle
               */
              else if (aGrandParent.length == 1) {
                var iCurrentContentLength = aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom[0].Content[0]["_"].length;
                if(iCurrentContentLength == 1) {
                  aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom[0].Content[0]["_"] = "";
                  oCaretPosition.focusId = aGrandParent[iGrandIndex].CharacterStyleRange[0].Custom[0].Content[0]["$"]["data-uid"];
                  oCaretPosition.indexToFocus = 0;
                } else {

                  var pathForPara2 = targetPath.split('/');
                  pathForPara2.splice(0, 1);
                  pathForPara2.splice(-1, 1);
                  var oUltimateParentForPara = _searchClosestCustomOfLastInPath(currentStory, pathForPara2);
                  var aUltimateCustomForPara = oUltimateParentForPara.objectPos;
                  var jIndexForPara = oUltimateParentForPara.indexPos;
                  aUltimateCustomForPara.splice(jIndexForPara, 1);
                  _setCaretPosition(aUltimateCustomForPara, jIndexForPara, pathForPara2, currentStory);
                }
                //_triggerChange();
              }
            }

          }
          else if (aParent.length > 1) {
            /**
             * delete only current node and append all other remaining to previous.
             */
            if ((iParent + 1) != aParent.length) {
              var afterNodes = aParent.splice(iParent + 1);
            }

            //Caret positioning
            var aPath = targetPath.split('/');
            aPath.splice(0, 1);
            //TODO: Make Following API Reusable for backspaced
            _setCaretPosition(aParent, iParent, aPath, currentStory);

            aParent.splice(iParent, 1);

            if (afterNodes) {
              _.assign(aParent, aParent.concat(afterNodes));
            }
            //_triggerChange();
          }
        }


        /** for normal backSpace. */
        else if (iStartIndex >= 1) {
          var str = oCurrentDom.firstChild.data;
          aParent[iParent].Content[0]["_"] = str.slice(0, iStartIndex - 1) + str.slice(iStartIndex);

          if(iStartIndex > 1) {
            oCaretPosition.focusId = aParent[iParent].Content[0]["$"]["data-uid"];
            oCaretPosition.indexToFocus = iStartIndex - 1;

          } else {
            _setCaretPosition(aParent, iParent, path, currentStory);
          }

        }
        _triggerChange();
      } else {
        handleContentTextChangedForRangeSelection(oSelection, targetPath, "");
      }


    },

    handleTabPressed: function (oEvent, sel, targetPath) {

      var selType = sel.type;

      if(selType == "Caret"){
        var tenSpaces = "          ";
        var path = targetPath.split("/");
        var currentStoryId = path.splice(0, 1);
        var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];
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
            var newContentObj2 = _createContentNode(tenSpaces);
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
      }


    },


    handleDeletePressed: function (oEvent, sel, targetPath) {

      var selType = sel.type;

      if(selType == "Caret"){
        var iRange = sel.getRangeAt(0);

        var path = targetPath.split("/");
        var currentStoryId = path.splice(0, 1);
        var currentStory = oStoryData[currentStoryId]["idPkg:Story"]["Story"][0];
        var returnedObject = _searchClosestCustomOfLastInPath(currentStory, path);
        var aParent = returnedObject.objectPos;
        var iIndex = returnedObject.indexPos;


        /** if key is pressed on BR node */
        if(returnedObject.flag==true){

          aParent.splice(iIndex,1);

          var pathCharaBr = targetPath.split('/');
          pathCharaBr.splice(0,1);
          pathCharaBr.splice(-1,1);

          /** if Br is the only node in that charaStyle then remove that CharaStyle */
          if(aParent.length == 0){
            _ifOnlyChildDelete(currentStory, pathCharaBr);
          }
          else {
            if(aParent[iIndex]){
              _handleCaretIfNotOnlyChildDelete(aParent, iIndex);
            }
            /** go one level up*/
            else if(!aParent[iIndex]){
              pathCharaBr.splice(-1,1);

              var oRetBr = _searchClosestCustomOfLastInPath(currentStory, pathCharaBr);
              var aRetBr = oRetBr.objectPos;
              var iRetBr = oRetBr.indexPos;

              if(aRetBr[iRetBr+1]){
                _handleCaretIfNotOnlyChildDelete(aRetBr, iRetBr+1);
              }
              /** again go one level up*/
              else{
                pathCharaBr.splice(-1,1);

                var oRetBr2 = _searchClosestCustomOfLastInPath(currentStory, pathCharaBr);
                var aRetBr2 = oRetBr2.objectPos;
                var iRetBr2 = oRetBr2.indexPos;

                if(aRetBr2[iRetBr2+1]){
                  _handleCaretIfNotOnlyChildDelete(aRetBr2, iRetBr2+1);
                }
              }
            }
          }
        }

        /** if key is pressed on the last position of the current node */
        else if (iRange.endOffset == aParent[iIndex].Content[0]["_"].length)    //sel is necessary.
        {

          /** if current node has next node. (Current node will always be CONTENT and next will always be either XMLTag or Br)  */
          if (aParent[iIndex + 1]) {
            var focusID = aParent[iIndex].Content[0]["$"]["data-uid"];
            var indexToFocus = aParent[iIndex].Content[0]["_"].length;
            _setCaretPositionAccordingToObjectDelete(focusID, indexToFocus);
            handleCharaOfDelete(aParent, iIndex + 1);
          }

          /** if current node is the last node of its parent , i.e. it is the last node of current characterStyle.  */
          else if (iIndex == aParent.length - 1) {

            var pathForChara = targetPath.split("/");
            pathForChara.splice(0,1);
            pathForChara.splice(-1,1);
            var oParentOfCharacter = _searchClosestCustomOfLastInPath(currentStory,pathForChara);
            var aCustom = oParentOfCharacter.objectPos;
            var charIndex = oParentOfCharacter.indexPos;

            /*aCustom.splice(charIndex, 1);
             charIndex = charIndex - 1;    //local temp soln.
             */
            /**if parent node has next node*/
            if (aCustom[charIndex + 1]) {

              pathForChara.splice(-1,1);
              var oParentOfXML = _searchClosestCustomOfLastInPath(currentStory,pathForChara);
              var aCustomXML = oParentOfXML.objectPos;
              var charIndexXML = oParentOfXML.indexPos;



              if(aCustom[charIndex + 1].CharacterStyleRange){
                /*aCustom.splice(charIndex, 1);
                 charIndex = charIndex - 1;    //local temp soln.*/

                if(aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content){
                  var focusID2 = aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Content[0]["$"]["data-uid"];
                  var indexToFocus2 = 0;
                  _setCaretPositionAccordingToObjectDelete(focusID2, indexToFocus2);
                }else if(aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Br){
                  var focusID3 = aCustom[charIndex + 1].CharacterStyleRange[0].Custom[0].Br[0]["$"]["data-uid"];
                  _setCaretPositionAccordingToObjectDelete(focusID3);
                }

                handleCharaOfDelete(aCustom[charIndex + 1].CharacterStyleRange[0].Custom, 0, aCustom, charIndex + 1);

              }else /*if(aCustom[charIndex + 1].XMLElement)*/{
                handleCharaOfDelete(aCustom, charIndex + 1, aCustomXML, charIndexXML);
              }


            }
            /**if this is the last CharacterStyle.  handle paragraph merging*/
            else if(!aCustom[iIndex+1]){
              var pathForPara = targetPath.split("/");
              pathForPara.splice(0,1);
              pathForPara.splice(-1,1);
              pathForPara.splice(-1,1);
              var oParentOfPara = _searchClosestCustomOfLastInPath(currentStory,pathForPara);
              var aCustomPara = oParentOfPara.objectPos;
              var paraIndex = oParentOfPara.indexPos;

              /** next paraIndex exists*/
              if(aCustomPara[paraIndex+1]){
                if(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange){

                  if(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom[0].Br){
                    aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom.splice(0,1);

                    if(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom.length == 0){
                      aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom.splice(0,1);

                      if(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom.length == 0){
                        aCustomPara.splice(paraIndex+1,1);
                      }
                    }
                  }
                  else if(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom[0].Content){
                    var tempStr = aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom[0].Content[0]["_"];
                    if(tempStr.length>1){
                      aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom[0].Content[0]["_"] = tempStr.slice(1,tempStr.length);
                    }else if(tempStr.length == 1){
                      aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom[0].CharacterStyleRange[0].Custom.splice(0,1);
                    }
                    _.assign(aCustomPara[paraIndex].ParagraphStyleRange[0].Custom, aCustomPara[paraIndex].ParagraphStyleRange[0].Custom.concat(aCustomPara[paraIndex+1].ParagraphStyleRange[0].Custom));
                    aCustomPara.splice(paraIndex+1,1);
                  }
                }
              }
            }
          }
        }
        else if (iRange.endOffset < aParent[iIndex].Content[0]["_"].length){

          var grandParentpath = path;
          grandParentpath.splice(-1, 1);
          var oGrandparent = _searchClosestCustomOfLastInPath(currentStory, grandParentpath);
          var aGrandparent = oGrandparent.objectPos;
          var iGrandparent = oGrandparent.indexPos;

          handleCharaOfDelete(aParent, iIndex, aGrandparent, iGrandparent, iRange);
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

        var oSelection = window.getSelection();
        if(oSelection.rangeCount == 0 ) {
          return;
        }
        var oRange = oSelection.getRangeAt(0);

        var oRangeObject = _getDeepestDOM(oRange.startContainer, oRange.startOffset, oRange.commonAncestorContainer);
        var oCurrentDom = oRangeObject.currentDOM;
        var iStartRange = oRangeObject.startRange;

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
          this.handleBackspacePressed(oEvent,oCurrentDom, iStartRange, sPath, oSelection, oRange.startOffset);
        }

        else if (oEvent.keyCode == 46) { // Delete
          this.handleDeletePressed(oEvent, oSelection, sPath);
        }

        else if (oEvent.keyCode == 9) {  //Tab
          this.handleTabPressed(oEvent, oSelection, sPath);
        }
        else{
          this.handleContentTextChanged(oEvent,oSelection,sPath,oCurrentDom);
        }
        //_triggerChange();
      }
      //document.querySelector('[data-abc]')
    },

    /*    Styles related methods   */

    setStyleData: function (json) {
      oStyleData = json;
    },

    getStyleData: function () {
      return oStyleData;
    },

    /*    Image related methods   */

    setImageData: function(json){
      oImageData = json;
    },

    getImageData : function(){
      return oImageData;
    },

    handleListItemClicked: function(sStyleType, oEvent){

      var oSelection = window.getSelection();
      var sStyleId = oEvent.target.getAttribute('data-element-id');

      if(oSelection.rangeCount) {
        //Check if the selection in editable story only
        var oRange = oSelection.getRangeAt(0);
        var oStartNode = oRange.startContainer.parentNode.getAttribute("data-uid");
        if(oStartNode) {
          _applySelectedStyleToSelectedNode(oRange, sStyleType, sStyleId);
        }
      }

      _.forEach(oStyleData[sStyleType], function(oStyle, iIndex){
        oStyle.isSelected = oStyle.id == sStyleId;
      });
      _triggerChange();
    },

    handleSpreadClicked: function(oEvent){
      console.log(window.getSelection());
    }

  };

  return storyStore;

})();


MicroEvent.mixin(storyStore);

module.exports = storyStore;