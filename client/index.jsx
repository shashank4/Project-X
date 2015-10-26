/**
 * Created by DEV on 03-09-2015.
 */
var React = require('react');
var AppController = require('./../screen/controller/app-controller.jsx').view;
var StoryStore = require('./../screen/store/storyStore');
var LayoutStore = require('./../screen/store/layoutStore');
var StyleStore = require('./../screen/store/styleStore');
var StoryAction = require('./../screen/actions/story-action');

var LayoutData = require('./../data/layoutData.js');
var StoryData = require('./../data/storyData.js');
var StyleData = require('./../data/styleData.js');

LayoutStore.setStoreData(LayoutData);

StoryStore.setStoreData(StoryData);

StyleStore.setStoreData(StyleData);

React.render(<AppController
      storyStore={StoryStore}
      layoutStore={LayoutStore}
      styleStore={StyleStore}
      action={StoryAction}
    />,
    document.getElementById('MainContainerBody'));
