var React = require("react");
var CharacterStyleRange = require('./CharacterStyleRange.jsx');


var ParagraphStyleRange = React.createClass({

    getParagraph: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            for (var j = 0; j < obj[i].Custom.length; j++) {

                if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
                    var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
                    aStory.push(
                            <CharacterStyleRange data={aCharacterStyleRange} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
                    var XMLElement = require('./XMLElement.jsx');
                    var aToXMLElement = obj[i].Custom[j].XMLElement;
                    aStory.push(
                            <XMLElement data={aToXMLElement} key={uniq++}/>
                    );
                }
            }
        }
        return aStory;

    },

    render: function () {
        console.log("in ParagraphStyleRange");
        var aParagraph = this.getParagraph(this.props.data);
        return (
            <div className="paragraphContainer">
            {aParagraph}
            </div>
        );
    }


});

module.exports = ParagraphStyleRange;