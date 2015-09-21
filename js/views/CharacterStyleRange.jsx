var React = require("react");
//var CharacterStyleRange = require('./CharacterStyleRange.jsx');
var Content = require("./Content.jsx");
var BrTag = require("./Br.jsx");



var CharacterStyleRange = React.createClass({

    getCharacter: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            for (var j = 0; j < obj[i].Custom.length; j++) {

                if ((obj[i].Custom[j]).hasOwnProperty("CharacterStyleRange")) {
                    console.log("hasOwnProperty(CharacterStyleRange)");
                    var aCharacterStyleRange = obj[i].Custom[j].CharacterStyleRange;
                    aStory.push(
                            <CharacterStyleRange data={aCharacterStyleRange} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j]).hasOwnProperty("XMLElement")) {
                    var XMLElement = require('./XMLElement.jsx');
                    //console.log("hasOwnProperty(XMLElement)");
                    var aToXMLElement = obj[i].Custom[j].XMLElement;
                    //console.log("hasOwnProperty(XMLElement)2222222222222222222");
                    aStory.push(
                            <XMLElement data={aToXMLElement} key={uniq++}/>
                    );
                    //console.log("hasOwnProperty(XMLElement)33333333333333333333333");
                }


                if ((obj[i].Custom[j].hasOwnProperty("Content"))) {
                    //console.log("hasOwnProperty(Content)");
                    var aContent = obj[i].Custom[j].Content;
                    aStory.push(
                            <Content data={aContent} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j].hasOwnProperty("Br"))) {
                    //console.log("hasOwnProperty(Br)");
                    var aBr = obj[i].Custom[j].Br;
                    aStory.push(
                            <BrTag data={aBr} key={uniq++}/>
                    );
                }
            }
        }
        return aStory;

    },

    render: function () {
        console.log("in CharacterStyleRange");
        var aCharacter = this.getCharacter(this.props.data);
        return (
            <div className="characterContainer">
            {aCharacter}
            </div>
        );
    }


});

module.exports = CharacterStyleRange;