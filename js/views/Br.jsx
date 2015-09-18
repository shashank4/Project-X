var React = require("react");

var Br = React.createClass({

    getContent: function (obj) {
        var aStory = [];
        var uniq = 0;
        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {

        }
        return aStory;

    },

    render: function () {
        console.log("in Br");
        var aBr = this.getContent(this.props.data);
        return (
            <div>
            {aBr}
            </div>
        );
    }

});

module.exports = Br;