var React = require("react");
var _ = require('lodash');
var utils = require("../store/utils");

var Content = require("./content.jsx").view;
var BrTag = require("./Br.jsx");


var CharacterStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    key: React.PropTypes.object,
    path: React.PropTypes.string,
    pathToUpdate: React.PropTypes.string
  },

  getCharacter: function (arr) {
    var aStory = [];
    var arrLen = arr.length;
    var sPath = this.props.path;
    for (var i = 0; i < arrLen; i++) {
      sPath += "/" + arr[i]['$']['data-uid'];
      for (var j = 0; j < arr[i].Custom.length; j++) {

        if ((arr[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          console.log("hasOwnProperty(CharacterStyleRange)");
          var aCharacterStyleRange = arr[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange
                  key={j}
                  path={sPath}
                  data={aCharacterStyleRange}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }


        if ((arr[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var XMLElement = require('./XMLElement.jsx');
          var aToXMLElement = arr[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement
                  key={j}
                  path={sPath}
                  data={aToXMLElement}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }


        if ((arr[i].Custom[j].hasOwnProperty("Content"))) {
          var aContent = arr[i].Custom[j].Content;
          aStory.push(
              <Content
                  key={j}
                  path={sPath}
                  data={aContent}
                  parent={arr[i].Custom}/>
          );
        }


        if ((arr[i].Custom[j].hasOwnProperty("Br"))) {
          var aBr = arr[i].Custom[j].Br;
          aStory.push(
              <BrTag
                  key={j}
                  path={sPath}
                  data={aBr}/>
          );
        }
      }
    }
    return aStory;

  },

  shouldComponentUpdate: function(nextProps, nextState) {
   /* var sCharacterStyleId = this.props.data[0]['$']['data-uid'];
    return _.contains(nextProps.pathToUpdate, sCharacterStyleId);*/
    return true;
  },

  render: function () {
    var obj = this.props.data;
    var aCharacter = this.getCharacter(obj);

    var AppliedCharacterStyle = obj[0].$.AppliedCharacterStyle;
    var cssName = utils.getCharaStyleName(AppliedCharacterStyle);
    var className1 = "characterContainer " + cssName;
    var dataUID=this.props.data[0]["$"]["data-uid"];
    return (
        <span className={className1} data-uid={dataUID}>{aCharacter}</span>
    );
  }

});

module.exports = CharacterStyleRange;