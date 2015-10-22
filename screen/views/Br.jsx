var React = require("react");
var _ = require("lodash");

var Br = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    path: React.PropTypes.string,
    caretPosition: React.PropTypes.object
  },

  componentDidMount: function () {
    this.setCaretPosition();
  },

  componentDidUpdate: function () {
    this.setCaretPosition();
  },

  setCaretPosition: function () {
    if (this.props.caretPosition.focusId == this.props.data[0]["$"]["data-uid"]) {
      var oDOMNode = this.getDOMNode();
      var oRange = document.createRange();
      oRange.setStartAfter(oDOMNode);

      var oSelection = window.getSelection();
      oSelection.removeAllRanges();
      oSelection.addRange(oRange);
    }
  },

  render: function () {
    var myUID = this.props.data[0]["$"]["data-uid"];
    var sPath = this.props.path;
    var uniq = 0;
    return (
        <br className="br brContainer"
            data-uid={myUID}
            data-path={sPath}/>
    );
  }

});

module.exports = Br;
