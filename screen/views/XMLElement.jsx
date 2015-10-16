var React = require("react");
var ParagraphStyleRange = require("./paragraphStyleRange.jsx");
var CharacterStyleRange = require("./characterStyleRange.jsx");
var Content = require("./content.jsx").view;
var Br = require("./Br.jsx");


var XMLElement = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    path: React.PropTypes.string,
    pathToUpdate: React.PropTypes.string

  },

  getAXmlElements: function (obj) {
    var aStory = [];
    var objLen = obj.length;
    var sPath = this.props.path;
    for (var i = 0; i < objLen; i++) {
      sPath += "/" + obj[i]['$']['data-uid'];

      for (var j = 0; j < obj[i].Custom.length; j++) {

        if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
          var aToXMLElement = obj[i].Custom[j].XMLElement;
          aStory.push(
              <XMLElement
                  key={j}
                  path={sPath}
                  data={aToXMLElement}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
          var aToParagraphStyleRange = obj[i].Custom[j].ParagraphStyleRange;
          aStory.push(
              <ParagraphStyleRange
                  key={j}
                  path={sPath}
                  data={aToParagraphStyleRange}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
          var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
          aStory.push(
              <CharacterStyleRange
                  key={j}
                  path={sPath}
                  data={aCharacterStyleRange}
                  pathToUpdate={this.props.pathToUpdate}/>
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("Content")) {
          var aContent = obj[i].Custom[j].Content;
          aStory.push(
              <Content
                  key={j}
                  path={sPath}
                  data={aContent}
                  parent={obj[i].Custom}/>
          );
        }


        if ((obj[i].Custom[j]).hasOwnProperty("Br")) {
          var aBr = obj[i].Custom[j].Br;
          aStory.push(
              <Br
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
    var sXMLElementId = this.props.data[0]['$']['data-uid'];
    return _.contains(nextProps.pathToUpdate, sXMLElementId);
  },

  render: function () {
    var aXmlElements = this.getAXmlElements(this.props.data);
    var uid= this.props.data[0]["$"]["data-uid"];
    return (
        <span className="xmlElementContainer" data-uid={uid}>{aXmlElements}</span>
    );
  }
});

module.exports = XMLElement;
