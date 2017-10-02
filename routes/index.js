var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Index = require('../models/index');
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express!', os: os.hostname() });
});

// test c
router.get('/c', function(req, res, next) {
  var q = req.query.q;
  var indexModel = new Index({
    title: q
  })
    .save()
    .then(function(val) {
      res.json({
        msg: 'ok!',
        os: os.hostname()
      });
    });
});

module.exports = router;
