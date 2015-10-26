var _ = require('lodash');
var React = require('react');
var utils = require('../store/utils');

var List = React.createClass({

  handleListElementOnClick : function(evt){
    alert(this.props.header);
    console.log(evt);
  },

  render: function () {

    var aListElement = [];
    _.forEach(this.props.data, function(sName, sId){
      aListElement.push(<div
        onClick={this.handleListElementOnClick}
        data-element-id={sId}
        className="component-list-element">
          {sName}
      </div>);
    });

    return (

        <div className="component-list">
            <div className="component-list-header">{this.props.header}</div>
            <div className="compoenent-list-data">
              {aListElement}
            </div>
        </div>
    );
  }
});

module.exports = List;