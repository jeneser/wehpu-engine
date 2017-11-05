var path = require('path');
var fs = require('fs');
var uuidv4 = require('uuid/v4');
var logger = require('./logger');
var config = require('../config');
var util = require('./util');

var OSS = require('ali-oss').Wrapper;
var client = new OSS(config.aliOSS);

/**
 * 文件上传
 * @param {String} folder 目标文件夹
 * @param {String} file 本地目标文件字段
 * @param {String} mime 文件类型，过滤非法文件
 * @param {String} limit 自定义上传尺寸限制
 * @param {String} filesize 当前文件大小
 * @return {String} url 文件存放路径
 */
exports.upload = function (params) {
  var params = params || {};
  // 默认尺寸限制
  params._limitUploadSize = config.limitUploadSize;

  if (params.limit) {
    params._limitUploadSize = params.limit;
  }

  return new Promise((resolve, reject) => {
    // 过滤非法文件
    if (!util.filterMime(params.mime)) {
      // 移除临时文件
      util.unlink(params.file);

      reject('非法文件类型 ' + params.mime);
    } else if (+params.filesize > +params._limitUploadSize) {
      // 移除临时文件
      util.unlink(params.file);

      // 限制上传尺寸
      reject('文件尺寸过大');
    } else {
      // 上传文件
      client
        .put(params.folder + '/' + path.basename(params.file), params.file)
        .then(val => {
          // 移除临时文件
          util.unlink(params.file);

          resolve(val.res.requestUrls);
        })
        .catch(err => {
          // 移除临时文件
          util.unlink(params.file);

          logger.error('上传OSS失败', err);

          reject('上传OSS失败');
        })
    }
  });
}