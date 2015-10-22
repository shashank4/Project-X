var React = require("react");

var Events = {

};

var Content = React.createClass({


  propTypes:{
    data: React.PropTypes.array ,
    parent:React.PropTypes.array,
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
    var oCaretPosition = this.props.caretPosition;
    if(oCaretPosition.focusId == this.props.data[0]["$"]["data-uid"]) {
      var oDOMNode = this.getDOMNode().firstChild;
      var oRange = document.createRange();
      oRange.setStart(oDOMNode, oCaretPosition.indexToFocus);
      oRange.setEnd(oDOMNode, oCaretPosition.indexToFocus);
      var oSelection = window.getSelection();
      oSelection.removeAllRanges();
      oSelection.addRange(oRange);
    }
  },

  render: function () {
    var contentData=this.props.data[0]["_"];
    var myUID=this.props.data[0]["$"]["data-uid"];
    var sPath = this.props.path;

    return (
      <span  className="content contentContainer"
        ref="contentContainer"
        data-uid={myUID}
        data-path={sPath}>{contentData}</span>);
  }
});

module.exports = {
  view: Content,
  events: Events
};
