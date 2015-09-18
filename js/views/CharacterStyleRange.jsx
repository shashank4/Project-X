var React = require("react");
//var CharacterStyleRange = require('./CharacterStyleRange.jsx');
var Content=require("./Content.jsx");
var Br=require("./Br.jsx");


var CharacterStyleRange = React.createClass({

    getCharacter: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {

            if ((obj[i]).hasOwnProperty("CharacterStyleRange")) {
                console.log("hasOwnProperty(CharacterStyleRange)");
                var aCharacterStyleRange = obj[i].CharacterStyleRange;
                aStory.push(
                    <div key={uniq++}>
                        <CharacterStyleRange data={aCharacterStyleRange}/>
                    </div>
                );
            }


            if ((obj[i]).hasOwnProperty("XMLElement")) {
                var XMLElement = require('./XMLElement.jsx');

                console.log("hasOwnProperty(XMLElement)");
                var aToXMLElement = obj[i].XMLElement;
                console.log("hasOwnProperty(XMLElement)2222222222222222222");
                aStory.push(
                    <div key={uniq++}>
                        <XMLElement data={aToXMLElement}/>
                    </div>
                );
                console.log("hasOwnProperty(XMLElement)33333333333333333333333");
            }


            if((obj[i].hasOwnProperty("Content"))){
                console.log("hasOwnProperty(Content)");
                var aContent= obj[i].Content;
                aStory.push(
                    <div key={uniq++}>
                        <Content data={aContent}/>
                    </div>
                );
            }


            if((obj[i].hasOwnProperty("Br"))){
                console.log("hasOwnProperty(Br)");
                var aBr= obj[i].Br;
                aStory.push(
                    <div key={uniq++}>
                        <Br data={aBr}/>
                    </div>
                );
            }


        }
        return aStory;

    },

    render: function () {
        console.log("in CharacterStyleRange");
        var aCharacter = this.getCharacter(this.props.data);
        return (
            <div>
            {aCharacter}
            </div>
        );
    }


});

module.exports = CharacterStyleRange;