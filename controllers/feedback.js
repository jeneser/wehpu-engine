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
  // var images = req.body.images;
  var userInfo = req.body.userInfo;

  if (!title || !content || !labels || !userInfo) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    });
  }

  var data = {
    'title': '[' + userInfo.nick + ']' + title,
    'body': content + '*****' + '用户名: ' + userInfo.nick + '\r\n' + '手机型号: ' + userInfo.model + userInfo.platform + '\r\n' + '微信版本: ' + userInfo.wxVersion + 'Wehpu版本: ' + userInfo.wehpuVersion + '\r\n',
    'labels': labels
  }

  // 发起请求
  request
    .set({
      'Authorization': 'Bearer ' + config.githubToken
    })
    .send(data)
    .post('https://api.github.com/repos/hpufe/wehpu/issues')
    .then(data => {
      console.log(data);

      if (data.id && data.url) {
        res.status(201).json({
          statusCode: 201,
          msg: '反馈成功',
          data: {
            url: data.url
          }
        });
      } else {
        res.status(400).json({
          statusCode: 400,
          errMsg: '格式错误'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        statusCode: 500,
        errMsg: '反馈失败'
      });
    });
}