var React = require("react");
var CharacterStyleRange = require('./CharacterStyleRange.jsx');
var XMLElement = require('./XMLElement.jsx');

var ParagraphStyleRange = React.createClass({

    getParagraph: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {

            if ((obj[i]).hasOwnProperty("CharacterStyleRange")) {
                var aCharacterStyleRange = obj[i].CharacterStyleRange;
                aStory.push(
                    <div key={uniq++}>
                        <CharacterStyleRange data={aCharacterStyleRange}/>
                    </div>
                );
            }


            if ((obj[i]).hasOwnProperty("XMLElement")) {
                var aToXMLElement = obj[i].XMLElement;
                aStory.push(
                    <div key={uniq++}>
                        <XMLElement data={aToXMLElement}/>
                    </div>
                );
            }
        }
        return aStory;

    },

    render: function () {
        console.log("in ParagraphStyleRange");
        var aParagraph = this.getParagraph(this.props.data);
        return (
            <div>
            {aParagraph}
            </div>
        );
    }


});

module.exports = ParagraphStyleRange;