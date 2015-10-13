var React = require("react");
var utils = require("../store/utils");
var CharacterStyleRange = require('./characterStyleRange.jsx');
var XMLElement = require('./XMLElement.jsx');

var ParagraphStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.object,  // individual story data
    key: React.PropTypes.object
  },

  getParagraph: function (obj) {
    var aStory = [];
    var uniq = 0;
    var objLen = obj.length;
    for (var i = 0; i < objLen; i++) {
      for (var j = 0; j < obj[i].Custom.length; j++) {

        if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange data={aCharacterStyleRange} key={uniq++} />
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var XMLElement = require('./XMLElement.jsx');
          var aToXMLElement = obj[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement data={aToXMLElement} key={uniq++} />
          );
        }
      }
    }
    return aStory;

  },

  render: function () {
    console.log("in ParagraphStyleRange");
    var obj = this.props.data;
    var aParagraph = this.getParagraph(obj);
    var dataUID=this.props.data[0]["$"]["data-uid"];
    var cssName = utils.getParaStyleName2(obj[0].$.AppliedParagraphStyle);
    var className1 = "paragraphContainer " + cssName;

    return (
        <p className={className1} data-uid={dataUID}>
                {aParagraph}
        </p>
    );
  }


});

module.exports = ParagraphStyleRange;