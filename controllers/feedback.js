var path = require('path');
var fs = require('fs');
var request = require('superagent');
var logger = require('../common/logger');
var config = require('../config');

/**
 * 反馈
 */
exports.feedback = function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var labels = req.body.labels;
  var nick = req.body.nick;
  var model = req.body.model;
  var platform = req.body.platform;
  var wxVersion = req.body.wxVersion;
  var wehpuVersion = req.body.wehpuVersion;
  var images = req.body.images;

  if (!title || !content || !labels || !nick || !model || !platform || !wxVersion || !wehpuVersion) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    });
  }

  // 遍历图片
  if (images) {
    var _images = '';

    images.split(',').forEach(elem => {
      _images += '![img](' + elem + ')\r\n';
    });
  }

  // 拼接内容
  var data = {
    // 标题
    title: '[ ' + nick + ' ] ' + title,
    // 内容
    body: content + '\r\n\r\n' + '------' + '\r\n' + '用户名: ' + nick + '\r\n' + '手机型号: ' + model + ' ' + platform + '\r\n' + '微信版本: ' + wxVersion + '\r\n' + 'Wehpu版本: ' + wehpuVersion + '\r\n\r\n' + _images,
    // 标签
    labels: labels.split(',')
  }

  // 发起请求
  request
    .post('https://api.github.com/repos/hpufe/wehpu/issues')
    .set({
      'Authorization': 'Bearer ' + config.githubToken
    })
    .send(data)
    .then(content => {
      var _content = content.text;

      return new Promise((resolve, reject) => {
        if (_content.id && _content.url) {
          resolve(_content);
        } else {
          reject('反馈失败');
        }
      })
    })
    .then(content => {
      res.status(201).json({
        statusCode: 201,
        errMsg: '反馈成功',
        data: {
          url: content.url
        }
      });
    })
    .catch(err => {
      logger.error(err);

      res.status(500).json({
        statusCode: 500,
        errMsg: '反馈失败'
      });
    });
}