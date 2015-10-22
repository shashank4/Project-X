var _ = require('lodash');
var React = require('react');
var utils = require('../store/utils');

var List = React.createClass({

  render: function () {

    var aListElement = [];
    _.forEach(this.props.data, function(sString, iIndex){
      aListElement.push(<div className="component-list-element">{sString}</div>);
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