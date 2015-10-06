/**
 * Created by CS49 on 22-09-2015.
 */
require("node-jsx").install({extension: ".js"});

var React = require('react');
var Handlebars = require('handlebars');
var fs = require("fs");

var multer = require('multer'); // v1.0.5
var upload = multer();
var bodyParser=require('body-parser');
var express = require('express');
var app = express();


var oStoryData = require('./../data/storyData');
var spreadArray = require('./../data/layoutData');
var storyAction= require('../screen/actions/story-action');
var utils= require('../screen/store/utils');


var AppController = require('./../screen/controller/app-controller.jsx').view;
var layoutStore = require('./../screen/store/layoutStore.js');
var storyStore = require('./../screen/store/storyStore.js');


//console.log(oStoryData);
//console.log(spreadArray);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(renderedLayout);
});

app.post('/onClickSave', upload.array(), function(req, res, next) {
  console.log("before util");
  utils.getAllStoryData(req.body);
      //res.json(req.body);
});

app.use(express.static('./'));

app.listen(3500, function () {
    console.log("Listening on port 3500");
});