var React = require("react");
var ParagraphStyleRange = require("./paragraphStyleRange.jsx");
var CharacterStyleRange = require("./characterStyleRange.jsx");
var Content = require("./content.jsx").view;
var Br = require("./br.jsx");


var XMLElement = React.createClass({

    getAXmlElements: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            for (var j = 0; j < obj[i].Custom.length; j++) {

                if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
                    var aToXMLElement = obj[i].Custom[j].XMLElement;
                    aStory.push(
                            <XMLElement  key={uniq++} data={aToXMLElement}/>
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("ParagraphStyleRange")) {
                    var aToParagraphStyleRange = obj[i].Custom[j].ParagraphStyleRange;
                    aStory.push(
                            <ParagraphStyleRange data={aToParagraphStyleRange} key={uniq++} />
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
                    var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
                    aStory.push(
                            <CharacterStyleRange data={aCharacterStyleRange} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("Content")) {
                    var aContent = obj[i].Custom[j].Content;
                    aStory.push(
                            <Content data={aContent} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("Br")) {
                    var aBr = obj[i].Custom[j].Br;
                    aStory.push(
                            <Br data={aBr} key={uniq++}/>
                    );
                }
            }
        }
        return aStory;
    },

    render: function () {
        console.log("in XMLElement");
        var aXmlElements = this.getAXmlElements(this.props.data);
        return (
            <div className="xmlElementContainer" >
                {aXmlElements}
            </div>
        );
    }

});

module.exports = XMLElement;
