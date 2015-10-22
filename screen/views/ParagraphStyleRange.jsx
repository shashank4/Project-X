var React = require("react");
var _ = require('lodash');
var utils = require("../store/utils");
var CharacterStyleRange = require('./characterStyleRange.jsx');
var XMLElement = require('./XMLElement.jsx');

var ParagraphStyleRange = React.createClass({

  propTypes: {
    data: React.PropTypes.array,  // individual story data
    path: React.PropTypes.string,
    pathToUpdate: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  getParagraph: function () {
    var aStory = [];
    var uniq = 0;
    var arr = this.props.data;
    var arrLen = arr.length;
    var sPath = this.props.path;
    for (var i = 0; i < arrLen; i++) {
      sPath += "/" + arr[i]['$']['data-uid'];
      for (var j = 0; j < arr[i].Custom.length; j++) {
        if ((arr[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = arr[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange
                  key={j}
                  path={sPath}
                  data={aCharacterStyleRange}
                  pathToUpdate={this.props.pathToUpdate}
                  caretPosition={this.props.caretPosition}/>
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
                  pathToUpdate={this.props.pathToUpdate}
                  caretPosition={this.props.caretPosition}/>
          );
        }
      }
    }
    return aStory;

  },

  /**
   * check this functionality
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate: function(nextProps, nextState) {
   /* var sParagraphId = this.props.data[0]['$']['data-uid'];
    return _.contains(nextProps.pathToUpdate, sParagraphId);*/
    return true;
  },

  render: function () {
    var obj = this.props.data;
    var aParagraph = this.getParagraph();
    var dataUID=this.props.data[0]["$"]["data-uid"];
    var cssName = utils.getParaStyleName(obj[0].$.AppliedParagraphStyle);
    var className1 = "paragraphContainer " + cssName;

    return (
        <p className={className1} data-uid={dataUID}>{aParagraph}</p>
    );
  }


});

module.exports = ParagraphStyleRange;