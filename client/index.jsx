/**
 * Created by DEV on 03-09-2015.
 */
var React = require('react');
var AppController = require('./../screen/controller/app-controller.jsx').view;
var StoryStore = require('./../screen/store/storyStore');
var LayoutStore = require('./../screen/store/layoutStore');
var StoryAction = require('./../screen/actions/story-action');

var LayoutData = require('./../data/layoutData.js');
var StoryData = require('./../data/storyData.js');

LayoutStore.setStoreData(LayoutData);
StoryStore.setStoreData(StoryData);

React.render(<AppController
      storyStore={StoryStore}
      layoutStore={LayoutStore}
      action={StoryAction}
    />,
    document.getElementById('MainContainerBody'));
