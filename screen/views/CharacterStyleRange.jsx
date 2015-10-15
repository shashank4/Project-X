var React = require("react");
var utils = require("../store/utils");

var Content = require("./content.jsx").view;
var BrTag = require("./Br.jsx");


var CharacterStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    key: React.PropTypes.object
  },

  getCharacter: function (arr) {
    var aStory = [];

    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
      for (var j = 0; j < arr[i].Custom.length; j++) {

        var uniq = utils.generateUUID();
        if ((arr[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          console.log("hasOwnProperty(CharacterStyleRange)");
          var aCharacterStyleRange = arr[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange data={aCharacterStyleRange} key={uniq} />
          );
        }


        if ((arr[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var XMLElement = require('./XMLElement.jsx');
          var aToXMLElement = arr[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement data={aToXMLElement} key={uniq}  />
          );
        }


        if ((arr[i].Custom[j].hasOwnProperty("Content"))) {
          var aContent = arr[i].Custom[j].Content;
          aStory.push(
              <Content data={aContent} key={uniq} parent={arr[i].Custom} />
          );
        }


        if ((arr[i].Custom[j].hasOwnProperty("Br"))) {
          var aBr = arr[i].Custom[j].Br;
          aStory.push(
              <BrTag data={aBr} key={uniq}/>
          );
        }
      }
    }
    return aStory;

  },

  render: function () {
    var obj = this.props.data;
    var aCharacter = this.getCharacter(obj);

    var AppliedCharacterStyle = obj[0].$.AppliedCharacterStyle;
    var cssName = utils.getCharaStyleName(AppliedCharacterStyle);
    var className1 = "characterContainer " + cssName;
    var dataUID=this.props.data[0]["$"]["data-uid"];
    return (
        <span className={className1} data-uid={dataUID}>
            {aCharacter}
        </span>
    );
  }

});

module.exports = CharacterStyleRange;