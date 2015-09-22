var React = require('react');
var Canvas = require('../views/Canvas.jsx');


var AppController = React.createClass({

    propTypes:{
        layoutStore: React.PropTypes.object,
        storyStore: React.PropTypes.object
    },

    /*getInitialState: function () {

    },

    componentWillMount: function () {
        //this.props.storyStore.bind('change', this.storyStateChanged);
    },

    storyStateChanged: function () {

    },*/

    render: function () {
        console.log("In app controller....\n");
        var toCanvas=this.props.layoutStore.getStoreData();
        var storyStoreData=this.props.storyStore.getStoreData();

        return (
            <div className="appController">
                <Canvas layoutStoreData={toCanvas} storyStoreData={storyStoreData}/>
            </div>
        );
    }
});

module.exports = AppController;