var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var errorhandler = require('errorhandler');
var config = require('./config');

mongoose.Promise = bluebird;

var index = require('./routes/index');
var users = require('./routes/users');
var tools = require('./routes/tools');
var utils = require('./routes/utils');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/users', users);
app.use('/api/tools', tools);
app.use('/api/utils', utils);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    return res.status(500).json({
      statusCode: 500,
      errMsg: '内部服务器错误'
    });
  });
}

module.exports = app;