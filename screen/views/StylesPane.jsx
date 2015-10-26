var _ = require('lodash');
var React = require('react');
var utils = require('../store/utils');

var ListComponent = require('./List.jsx');

var StylesPane = React.createClass({

  propTypes: {
    stylesData : React.PropTypes.object
  },

  render: function () {

    var aLists = [];
    _.forEach(this.props.stylesData, function(oStyles,sStyleType){
      aLists.push(
          <ListComponent
          data={oStyles}
          header={sStyleType}/>);
    });

    return (

        <div className="style-pane">
          {aLists}
        </div>
    );
  }
});

module.exports = StylesPane;