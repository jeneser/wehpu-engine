var os = require('os');
var express = require('express');
var router = express.Router();

/**
 * index
 * @method get
 */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Wehpu!',
    os: os.hostname()
  });
});

/**
 * 404
 * @method get
 */
router.get('*', function (req, res, next) {
  res.status(404).json({
    statusCode: 404,
    errMsg: '请求错误'
  });
});

module.exports = router;