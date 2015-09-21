var React = require("react");
var uniq = 0;
var BrTag = React.createClass({

    getBr: function (obj) {
        var aStory = [];

        var objLen = obj.length;
        for (var i = 0; i < objLen; i++) {
            aStory.push(<br className="br" key={uniq++}/>);

        }
        return aStory;
    },

    render: function () {
        console.log("in Br");
        //var aBr = this.getBr(this.props.data);
        return (
            <br />
        );
    }

});

module.exports = BrTag;