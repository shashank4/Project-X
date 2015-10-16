var React = require("react");
var utils = require("../store/utils");
var CharacterStyleRange = require('./characterStyleRange.jsx');
var XMLElement = require('./XMLElement.jsx');

var ParagraphStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.array,  // individual story data
    key: React.PropTypes.object,
    path: React.PropTypes.string,
    pathToUpdate: React.PropTypes.string
  },

  getParagraph: function (arr) {
    var aStory = [];
    var uniq = 0;
    var arrLen = arr.length;
    var sPath = this.props.path;
    for (var i = 0; i < arrLen; i++) {
      sPath += "/" + arr[i]['$']['data-uid'];
      for (var j = 0; j < arr[i].Custom.length; j++) {
        if ((arr[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = arr[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange
                  key={uniq++}
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
                  key={uniq++}
                  path={sPath}
                  data={aToXMLElement}
                  pathToUpdate={this.props.pathToUpdate}/>
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