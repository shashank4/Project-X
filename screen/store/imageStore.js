var imageStore = (function () {
  var oJson = {};

  return {

    setStoreData: function (json) {
      oJson = json;
    },

    getStoreData: function () {
      return oJson;
    }
  };
})();

module.exports = imageStore;