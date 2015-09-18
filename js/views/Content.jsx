var React = require("react");

var Content = React.createClass({

    getContent: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {

        }
        return aStory;

    },

    render: function () {
        console.log("in Content");
        var aContent = this.getContent(this.props.data);
        return (
            <div>
            {aContent}
            </div>
        );
    }

});

module.exports = Content;