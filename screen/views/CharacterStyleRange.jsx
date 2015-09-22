var React = require("react");
//var CharacterStyleRange = require('./CharacterStyleRange.jsx');
var utils= require("../store/utils");

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
                    var aToXMLElement = obj[i].Custom[j].XMLElement;
                    aStory.push(
                            <XMLElement data={aToXMLElement} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j].hasOwnProperty("Content"))) {
                    var aContent = obj[i].Custom[j].Content;
                    aStory.push(
                            <Content data={aContent} key={uniq++}/>
                    );
                }


                if ((obj[i].Custom[j].hasOwnProperty("Br"))) {
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
        var obj=this.props.data;
        var aCharacter = this.getCharacter(obj);

        var AppliedCharacterStyle=obj[0].$.AppliedCharacterStyle;
        var cssName=utils.getCharaStyleName2(AppliedCharacterStyle);
        console.log(cssName);
        var className1="characterContainer "+cssName;

        return (
            <div className={className1}>
            {aCharacter}
            </div>
        );
    }


});

module.exports = CharacterStyleRange;