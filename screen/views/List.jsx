var _ = require('lodash');
var React = require('react');
var utils = require('../store/utils');
//var StoryAction = require('../actions/story-action');
var EventDispatcher = require("../../libraries/eventDispacher/EventDispatcher");

var Events = {

  LIST_ITEM_CLICKED : "list_item_clicked"

};

var List = React.createClass({

  sDefaultClassName : "component-list-element",

  handleListElementOnClick : function(evt){
    EventDispatcher.dispatch(Events.LIST_ITEM_CLICKED, this, this.props.header, evt);
  },

  /*deSelectAllElements : function(oElement){
    _.forEach(oElement.childNodes, function(oChildElement){
      oChildElement.className = this.sDefaultClassName;
    });
  },*/

  render: function () {

    var aListElement = [];
    _.forEach(this.props.data, function(oElementDetails, iIndex){
      var sClasses = this.sDefaultClassName;
      if(oElementDetails.isSelected){
        sClasses += " selected";
      }
      aListElement.push(<div
        onClick={this.handleListElementOnClick}
        data-element-id={oElementDetails.id}
          key={iIndex}
        className={sClasses}>
          {oElementDetails.name}
      </div>);
    }.bind(this));

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

module.exports = {
  view: List,
  events: Events
};