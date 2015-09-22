var layoutStore = (function () {


    /* var splitBySpaceString=function(str){
     str=str.split(' ');
     return str; //str is an array
     };

     var getSpreadCount=function(){
     return oJson.length;
     };*/
    var aJson = [];

    return {

        setStoreData: function (json) {
            console.log("-------------------------------------------------------------------");
            console.log(json);
            aJson = json;
        },

        getStoreData: function () {
            return aJson;
        },

        getPageDimension: function (obj, p) {
            var geometricBoundsString = obj['idPkg:Spread'].Spread[0].Page[p].$.GeometricBounds;
            var geometricBoundsArray = geometricBoundsString.split(" ");
            var oPageDim = {};

            oPageDim['topLeftX'] = parseInt(geometricBoundsArray[0]);
            oPageDim['topLeftY'] = parseInt(geometricBoundsArray[1]);
            oPageDim['rightBottomX'] = parseInt(geometricBoundsArray[3]);
            oPageDim['rightBottomY'] = parseInt(geometricBoundsArray[2]);
            oPageDim['height'] = parseInt(geometricBoundsArray[2]);
            oPageDim['width'] = parseInt(geometricBoundsArray[3]);
            return oPageDim;
        },

        getBindingLocation: function (s) {
            return parseInt(aJson[s]['idPkg:Spread'].Spread[0].$.BindingLocation);
        },


        getHalfPageHeight: function (obj) {
            //console.log("getHalfPageHeight");
            var abc = (obj.Page[0].$.GeometricBounds).split(" ");
            var xyz = parseInt(abc[2]) / 2;
            //console.log("halfPage Height:"+xyz);
            return xyz;
        },


        getSpreadDimension: function (s) {
            var pageCount = parseInt(aJson[s]['idPkg:Spread'].Spread[0].$.PageCount);
            var totPageWidth = 0;
            var maxPageHeight = 0;
            var leftMargin;
            for (var p = 0; p < pageCount; p++) {
                var oPageDim = this.getPageDimension(s, p);
                totPageWidth = totPageWidth + oPageDim.width;
                if (oPageDim.height > maxPageHeight) {
                    maxPageHeight = oPageDim.height;
                }

            }
            var BL = this.getBindingLocation(s);
            if (BL == 0) {
                leftMargin = 1224;
            }
            else if (BL == 1) {
                leftMargin = 612;
            }


        }
    };
})();

module.exports = layoutStore;