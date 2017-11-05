var path = require('path');
var fs = require('fs');
var uuidv4 = require('uuid/v4');
var formidable = require('formidable');
var logger = require('../common/logger');
var config = require('../config');
var util = require('../common/util');
var fileUpload = require('../common/upload');

/**
 * 文件上传
 * @param {String} folder 目标文件夹
 * @param {String} file 目标文件字段
 * @param {String} prefix 文件前缀
 * @return {String} url 文件存放路径
 */
exports.upload = function (req, res, next) {
  // 解析form data
  var form = new formidable.IncomingForm();
  // 临时文件目录
  form.uploadDir = path.join(__dirname, '../tmpdir');
  // 限制上传尺寸
  form.maxFieldsSize = config.limitUploadSize;

  form.parse(req, function (err, fields, files) {
    var folder = fields.folder;
    var prefix = fields.prefix;
    var fileInfo = files.file;

    // 验证并过滤非白名单文件
    if (!folder || !prefix || util.filterMime(fileInfo.type) === false || +fileInfo.size > +config.limitUploadSize) {
      res.status(400).json({
        statusCode: 400,
        errMsg: '格式错误'
      });

      // 移除临时文件
      if (fs.existsSync(path)) {
        fs.unlink(path);
      }
    }

    // 文件后缀转换
    var _suffix = util.mimeToExt(fileInfo.type);
    // 前缀文件名
    var fileName = prefix + uuidv4();
    // 后缀
    var suffix = '.' + (_suffix ? _suffix : 'unknown');
    // 临时文件路径
    var tmpPath = path.join(__dirname, '../tmpdir/', fileName + suffix);

    // 重命名文件
    fs.renameSync(fileInfo.path, tmpPath, err => {
      logger.error('重命名失败', err);

      res.status(500).json({
        statusCode: 500,
        errMsg: '上传失败'
      });
    });

    // 上传文件
    Promise.resolve(fileUpload.upload({
        folder: folder,
        file: tmpPath,
        mime: fileInfo.type,
        filesize: fileInfo.size,
        limit: config.limitUploadSize
      }))
      .then(url => {
        // 返回文件url
        res.status(201).json({
          statusCode: 201,
          errMsg: '上传成功',
          data: {
            url: url
          }
        });
      })
      .catch(err => {
        logger.error('文件上传失败', err);

        res.status(500).json({
          statusCode: 500,
          errMsg: '上传失败'
        });
      });
  });
}