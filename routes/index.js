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

// 404
router.get('*', function (req, res, next) {
  res.status(404).json({
    statusCode: 404,
    errMsg: '请求错误'
  });
});

module.exports = router;