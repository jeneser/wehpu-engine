var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var errorhandler = require('errorhandler');
var config = require('./config');
var requestLog = require('./middlewares/log');
var logger = require('./common/logger');

mongoose.Promise = bluebird;

var web = require('./routes/web');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// request log
app.use(requestLog);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/api/v1', api);
app.use('/', web);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error(err);

    return res.status(500).json({
      statusCode: 500,
      errMsg: '内部服务器错误'
    });
  });
}

module.exports = app;