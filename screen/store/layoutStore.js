var layoutStore = (function () {
    var aJson = [];

    return {

        setStoreData: function (json) {
            aJson = json;
        },

        getStoreData: function () {
            return aJson;
        }
    };
})();

module.exports = layoutStore;