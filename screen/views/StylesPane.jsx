var _ = require('lodash');
var React = require('react');
var utils = require('../store/utils');

var ListComponent = require('./List.jsx');

var StylesPane = React.createClass({

  propTypes: {
    stylesData : React.PropTypes.array
  },

  render: function () {

    var aLists = [];
    _.forEach(this.props.stylesData, function(aStyles,sStyleType){
      aLists.push(
          <ListComponent
          data={aStyles}
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