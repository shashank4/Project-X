var React = require("react");

var Content = React.createClass({

    getContent: function (obj) {
        var aStory = [];
        var innerHtml;
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            if (obj[i].hasOwnProperty("_")) {
                innerHtml = obj[i]["_"];
                aStory.push( <div  className="content" key={uniq++} dangerouslySetInnerHTML={{__html: innerHtml}} />);
            }
        }
        return aStory;

    },

    render: function () {
        console.log("in Content");
        var uniq = 0;
        var aContent = this.getContent(this.props.data);
        /*var obj=this.props.data;
        var innerHtml;

        for (var i = 0; i < obj.length; i++) {
            if (obj[i].hasOwnProperty("_")) {
                innerHtml = obj[i]["_"];
                //aStory.push( <span  className="content" key={uniq++} dangerouslySetInnerHTML={{__html: innerHtml}} />);
            }
        }*/
        return (<div className="contentContainer" data-wrapper="content" key={uniq++} >{aContent}</div>);
        /*<div data-wrapper="contentContainer">
            {aContent}
        </div>
*/
    }

});

module.exports = Content;