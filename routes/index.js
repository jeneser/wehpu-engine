var express = require('express');
var os = require('os');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Wehpu!',
    os: os.hostname()
  });
});

module.exports = router;