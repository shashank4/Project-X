var styleStore = (function () {
  var oStyles = {};

  return {

    setStoreData: function (json) {
      oStyles = json;
    },

    getStoreData: function () {
      return oStyles;
    },

    getCharacterStyles: function () {
      return oStyles['Character Style'];
    },

    getParagraphStyles: function () {
      return oStyles['Paragraph Style'];
    }
  };
})();

module.exports = styleStore;