/**
 * Created by DEV on 03-09-2015.
 */
var React = require('react');
var AppController = require('./../screen/controller/app-controller.jsx').view;
var StoryStore = require('./../screen/store/storyStore');
var LayoutStore = require('./../screen/store/layoutStore');
var ImageStore = require('./../screen/store/imageStore');
var StoryAction = require('./../screen/actions/story-action');

var LayoutData = require('./../data/layoutData.js');
var StoryData = require('./../data/storyData.js');
var StyleData = require('./../data/styleData.js');
var ImageData = require('./../data/imageData.js');

LayoutStore.setStoreData(LayoutData);

StoryStore.setStoreData(StoryData);

StoryStore.setStyleData(StyleData);

ImageStore.setStoreData(ImageData);

React.render(<AppController
      storyStore={StoryStore}
      layoutStore={LayoutStore}
      storyAction={StoryAction}
      imageStore={ImageStore}
    />,
    document.getElementById('MainContainerBody'));
