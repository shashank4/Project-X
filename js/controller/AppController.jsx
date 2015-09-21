var React = require('react');
var Canvas = require('../views/Canvas.jsx');


var AppController = React.createClass({
    /*var getMarkup=function(){
        return storyData;
    },*/

    propTypes:{
      store: React.PropTypes.object.isRequired
    },

    render: function () {
        console.log("In app controller....\n");
        var storyData=(this.props.storyStore).getStoreData();
        //console.log("storyData is:"+JSON.stringify(storyData));

        /*var dElement=this.refs.domReference;
        var d=dElement.createElement('div');
        var newD = React.createElement('div');
        console.log("storyData is2222222:"+storyData);
        d.innerHTML = storyData;
        var dInner= d.firstChild;*/

        //console.log("storyData is333333:"+storyData);
        //var json = this.props.store.getStoreData();
        return (
            <div className="appController">
                <Canvas store={this.props.store}/>
            </div>
        );//<div dangerouslySetInnerHTML={{__html: storyData}} />
    }
});

module.exports = AppController;