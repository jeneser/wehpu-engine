var os = require('os');
var express = require('express');
var router = express.Router();

var uploadController = require('../controllers/upload');

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
 * 文件上传
 * @method post
 * @param {String} folder 目标文件夹
 * @param {*} file 目标文件字段
 * @return {RES} statusCode 201/400/500 上传成功/失败
 */
router.post('/upload', uploadController.upload);

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