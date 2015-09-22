var React = require('react');
var Canvas = require('../views/Canvas.jsx');


var AppController = React.createClass({

    propTypes:{
      store: React.PropTypes.object.isRequired
    },

    render: function () {
        console.log("In app controller....\n");

        return (
            <div className="appController">
                <Canvas layoutStore={this.props.layoutStore} storyStore={this.props.storyStore}/>
            </div>
        );
    }
});

module.exports = AppController;