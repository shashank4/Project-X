var React = require("react");

var Content = React.createClass({

    /*getContent: function (obj) {
        var aStory = [];
        var innerHtml;
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            if (obj[i].hasOwnProperty("_")) {
                innerHtml = obj[i]["_"];
                aStory.push( <span  className="content" key={uniq++} dangerouslySetInnerHTML={{__html: innerHtml}} />);
            }
            //console.log("innerHtml" + innerHtml);
        }
        return aStory;

    },*/

    render: function () {
        console.log("in Content");
        //var aContent = this.getContent(this.props.data);
        var obj=this.props.data;
        var innerHtml;
        var uniq = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].hasOwnProperty("_")) {
                innerHtml = obj[i]["_"];
                //aStory.push( <span  className="content" key={uniq++} dangerouslySetInnerHTML={{__html: innerHtml}} />);
            }
        }
        return (<div className="contentContainer" data-wrapper="content" key={uniq++} dangerouslySetInnerHTML={{__html: innerHtml}} />);
        /*<div data-wrapper="contentContainer">
            {aContent}
        </div>
*/
    }

});

module.exports = Content;