var Spread = require('./Spread.jsx');

var React = require('react');
var layoutStore=require('../store/layoutStore.js')

var Canvas = React.createClass({

    getStore: function () {
        return this.props.store.getStoreData();
    },

    render: function () {
        var obj=layoutStore.getStoreData();
        var pageDimObj=layoutStore.getPageDimension(obj[0],0);
        var pageHeight=pageDimObj.height;
        console.log("obj length is:"+obj.length);
        var spreadCount=obj.length;

        var cHeight=(spreadCount*(pageHeight+144))+(72*2)+(36*(spreadCount-1));
        var cWidth=(2448*2);
        var oCstyle = {
            padding:"72px",
            height: cHeight+"px",
            width: cWidth+"px",
            //position: "absolute",
            left: "100px",
            top: "100px"
            //zIndex: 0
        };

        console.log("in canvas");
        return (

            <div className="canva" style={oCstyle}>
                <Spread store={this.getStore}/>
            </div>
        );
    }
});

module.exports = Canvas;