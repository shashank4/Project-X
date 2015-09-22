var Frame = require('./Frame.jsx');
var React = require('react');
//var oUtils = require('../../utils.js');
//var layoutStore = require('../store/layoutStore.js');

var frameVisitCount=0;
var Pages = React.createClass({


    getPagesView: function (obj) {
        var pageVisitCount=0;
        //console.log("In getPagesView:::///");
        var aPg = [];
        var left=0;
        var pageCount=(parseInt(obj['idPkg:Spread'].Spread[0].$.PageCount));
        for (var i = 0; i < pageCount; i++) {

            var oPageDim = (this.props.layoutStore).getPageDimension(obj, i);

            var height = oPageDim.height;
            var width = oPageDim.width;
            var bindingLocation = parseInt(obj['idPkg:Spread'].Spread[0].$.BindingLocation);

            if (bindingLocation == 0 && pageCount==1)
                left = (width*2);
            else
                left = left + width;

            //console.log("left of page:"+left+"    Binding Location:"+bindingLocation);

            var oStyle = {
                height: height + "px",
                width: width + "px",
                //id: 'page' + i,
                position: "absolute",
                left: left + "px",
                top: 72 + "px"
                //zIndex: 1
            };
            var oMstyle = {
                height: (height - 72) + "px",
                width: (width - 72) + "px",
                position: "absolute",
                left: "36px",
                top: "36px"
                //zIndex: 0
            };

            if(pageVisitCount==0/*(pageCount-1)*/) {
                pageVisitCount++;
                aPg.push(
                    <div className="page" style={oStyle} key={pageVisitCount}>
                        <div className="innerpage" style={oMstyle}/>

                    </div>);
            }// <Frame data={obj['idPkg:Spread'].Spread[0]} bindingLocation={bindingLocation}/>
            else
            {
                pageVisitCount++;
                aPg.push(
                    <div className="page" style={oStyle} key={pageVisitCount}>
                        <div className="innerpage" style={oMstyle} key={pageVisitCount+1000} />
                    </div>);
            }//<Frame data={obj['idPkg:Spread'].Spread[0]}/>
        }
        return (aPg);
    },
    render: function () {
        console.log("In Pages:::///");
        var aPages = this.getPagesView(this.props.data);
        return (
            <div>
              {aPages}
            </div>
        );

    }
});

module.exports = Pages;