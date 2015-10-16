var React = require("react");
var ParagraphStyleRange = require("./paragraphStyleRange.jsx");
var CharacterStyleRange = require("./characterStyleRange.jsx");
var Content = require("./content.jsx").view;
var Br = require("./Br.jsx");


var XMLElement = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    path: React.PropTypes.string

  },

  getAXmlElements: function (obj) {
    var aStory = [];
    var uniq = 0;
    var objLen = obj.length;
    var sPath = this.props.path;
    for (var i = 0; i < objLen; i++) {
      sPath += "/" + obj[i]['$']['data-uid'];

      for (var j = 0; j < obj[i].Custom.length; j++) {

        if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var aToXMLElement = obj[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement  path={sPath} key={uniq++} data={aToXMLElement} />
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
          var aToParagraphStyleRange = obj[i].Custom[j].ParagraphStyleRange;
          aStory.push(
              <ParagraphStyleRange path={sPath} data={aToParagraphStyleRange} key={uniq++} />
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange path={sPath} data={aCharacterStyleRange} key={uniq++} />
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("Content")) {
          var aContent = obj[i].Custom[j].Content;
          aStory.push(
              <Content path={sPath} data={aContent} key={uniq++} parent={obj[i].Custom}   />
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("Br")) {
          var aBr = obj[i].Custom[j].Br;
          aStory.push(
              <Br path={sPath} data={aBr} key={uniq++}/>
          );
        }
      }
    }
    return aStory;
  },

  render: function () {
    var aXmlElements = this.getAXmlElements(this.props.data);
    var uid= this.props.data[0]["$"]["data-uid"];
    return (
        <span className="xmlElementContainer" data-uid={uid}>
                {aXmlElements}
        </span>
    );
  }
});

module.exports = XMLElement;
