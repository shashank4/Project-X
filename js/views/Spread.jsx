var Pages = require('./Pages.jsx');
var Frame = require('./Frame.jsx');
//var oUtils = require('../../utils.js');
var React = require('react');
var layoutStore=require('../store/layoutStore.js');

var Spread = React.createClass({

    getStore: function () {
        return this.props.store;
    },

    getSpreadView: function (obj) {
        //var obj2= layoutStore.getStoreData();
        //console.log("heeehehehehehe");


        //console.log("in getSpreadView ");
        var aSp = [];
        var height;
        //var width = 2448;

        var gTop=0;
        //console.log("spread length is:"+obj.length);
        for (var i = 0; i < obj.length; i++) {

            var pageCount=parseInt(obj[i]['idPkg:Spread'].Spread[0].$.PageCount);
            var width=1224+612;
            if(pageCount<=2)
                width=2448;
            else {
                for (var j = 1; j < pageCount; j++) {

                    var tempPageDim = layoutStore.getPageDimension(obj[i], j);
                    width = (width) + tempPageDim.width;

                }
            }
            var tempPageDim2 = layoutStore.getPageDimension(obj[i], 0);
            height=tempPageDim2.height+144;

            if(i!=0)
            {
                gTop=gTop+height+36;
            }

            var oStyle = {
                height: height + "px",
                width: width + "px",
                position: "absolute",
                top:  gTop+36+"px",
                left: "36px"
                //zIndex: 0
            };

            var dataToFrame=obj[i]['idPkg:Spread'].Spread[0];
            var bindingLocation = parseInt(obj[i]['idPkg:Spread'].Spread[0].$.BindingLocation);
            aSp.push(
                <div className="spread" style={oStyle} key={i+1000}>
                    <Pages data={obj[i]} />
                    <Frame data={dataToFrame} bindingLocation={bindingLocation} />
                </div>
            );

        }

        return (aSp);
    },
    render: function () {
        console.log("in Spread");
        var aSpreads = this.getSpreadView(layoutStore.getStoreData());
        return (
            <div className="spreadClass" >
                {aSpreads}
            </div>
        );
    }
});

module.exports = Spread;