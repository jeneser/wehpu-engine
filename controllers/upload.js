var path = require('path');
var fs = require('fs');
var uuidv4 = require('uuid/v4');
var request = require('superagent');
var logger = require('../common/logger');
var config = require('../config');
var formidable = require('formidable');
var OSS = require('ali-oss').Wrapper;

var client = new OSS(config.aliOSS);

/**
 * 文件上传
 * @param {String} folder 目标文件夹
 * @return {String} url 文件存放路径
 */
exports.upload = function (req, res, next) {
  // 允许上传的文件类型
  var whiteList = ['image/jpeg', 'image/gif', 'image/png'];

  // 解析form data
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    var folder = fields.folder;

    var path = files.upload.path;
    var type = files.upload.type;
    var size = files.upload.size;

    // 生成文件名
    var filename = uuidv4() + '.' + type.split('/')[1];

    if (!folder || whiteList.find(elem => {
        return elem === type;
      }) === undefined) {
      res.status(400).json({
        statusCode: 400,
        errMsg: '格式错误'
      });
    }

    // 上传文件
    client
      .put(folder + filename, path)
      .then(val => {
        res.status(201).json({
          statusCode: 201,
          errMsg: '上传成功',
          data: {
            url: val.res.requestUrls
          }
        });
      })
      .catch(err => {
        logger.error(err);

        res.status(500).json({
          statusCode: 500,
          errMsg: '上传失败'
        });
      })
  });
}