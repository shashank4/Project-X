var layoutStore = (function () {
    var aJson = [];

    return {

        setStoreData: function (json) {
            console.log("-------------------------------------------------------------------");
            console.log(json);
            aJson = json;
        },

        getStoreData: function () {
            return aJson;
        }
    };
})();

module.exports = layoutStore;