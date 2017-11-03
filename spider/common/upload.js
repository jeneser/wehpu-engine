var path = require('path');
var fs = require('fs');
var uuidv4 = require('uuid/v4');
var logger = require('../common/logger');
var config = require('../config');
var util = require('./util');

var OSS = require('ali-oss').Wrapper;
var client = new OSS(config.aliOSS);

/**
 * 文件上传
 * @param {String} folder 目标文件夹
 * @param {String} file 本地目标文件字段
 * @param {String} mime 文件类型，过滤非法文件
 * @return {String} url 文件存放路径
 */
exports.upload = function (params) {
  var params = params || {};

  return new Promise((resolve, reject) => {
    if (!util.filterMime(params.mime)) {
      reject('非法文件类型');
    } else {
      // 上传文件
      client
        .put(params.folder + '/' + path.basename(params.file), params.file)
        .then(val => {
          // 移除临时文件
          if (fs.existsSync(params.file)) {
            fs.unlink(params.file);
          }
          resolve(val.res.requestUrls);
        })
        .catch(err => {
          // 移除临时文件
          if (fs.existsSync(params.file)) {
            fs.unlink(params.file);
          }

          logger.error('上传OSS失败');

          reject('上传OSS失败');
        })
    }
  });
}