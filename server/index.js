/**
 * Created by CS49 on 22-09-2015.
 */
require("node-jsx").install({extension: ".js"});   //jsxt

var React = require('react');
var Handlebars = require('handlebars');
var oStoryData = require('./../data/storyData');
var spreadArray = require('./../data/layoutData');
var storyAction= require('../screen/actions/story-action');

var fs = require("fs");
var AppController = require('./../screen/controller/app-controller.jsx');
var layoutStore = require('./../screen/store/layoutStore.js');
var storyStore = require('./../screen/store/storyStore.js');


console.log(oStoryData);
console.log(spreadArray);

storyStore.setStoreData(oStoryData);
layoutStore.setStoreData(spreadArray);

var AppControllerFactory = React.createFactory(AppController);

var renderedComponent = React.renderToString(
    AppControllerFactory({
        layoutStore:layoutStore,
        storyStore: storyStore,
        action:storyAction
    })
);

var fileData = fs.readFileSync(__dirname + '/template/layout.handlebars').toString();
var layoutTemplate = Handlebars.compile(fileData);

var renderedLayout = layoutTemplate({
    content: renderedComponent
});


var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send(renderedLayout);
});

app.use(express.static('./'));

app.listen(3500, function () {
    console.log("Listening on port 3500");
});
