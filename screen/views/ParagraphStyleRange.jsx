var React = require("react");
var utils = require("../store/utils");
var CharacterStyleRange = require('./characterStyleRange.jsx');
var XMLElement = require('./XMLElement.jsx');

var ParagraphStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.array,  // individual story data
    key: React.PropTypes.object
  },

  getParagraph: function (arr) {
    var aStory = [];
    var uniq = 0;
    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
      for (var j = 0; j < arr[i].Custom.length; j++) {

        if ((arr[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = arr[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange data={aCharacterStyleRange} key={uniq++} />
          );
        }


        if ((arr[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var XMLElement = require('./XMLElement.jsx');
          var aToXMLElement = arr[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement data={aToXMLElement} key={uniq++} />
          );
        }
      }
    }
    return aStory;

  },

  render: function () {
    var obj = this.props.data;
    var aParagraph = this.getParagraph(obj);
    var dataUID=this.props.data[0]["$"]["data-uid"];
    var cssName = utils.getParaStyleName(obj[0].$.AppliedParagraphStyle);
    var className1 = "paragraphContainer " + cssName;

    return (
        <p className={className1} data-uid={dataUID}>
                {aParagraph}
        </p>
    );
  }


});

module.exports = ParagraphStyleRange;