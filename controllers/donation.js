var request = require('superagent');
var logger = require('./common/logger');
var config = require('../config');

/**
 * 捐赠致谢
 */
exports.donation = function (req, res, next) {
  // 获取捐赠列表
  request
    .set({
      'Authorization': 'Bearer ' + config.githubToken
    })
    .get('https://api.github.com/repos/hpufe/wehpu/issues/5')
    // 处理列表
    .then(content => {
      return new Promise((resolve, reject) => {
        if (content.text) {
          var list = content.text.match(/@.+?rmb/ig).map(ele => {
            return [{
              donor: ele.split('|')[0].replace(/@|\s/g, ''),
              money: ele.split('|')[1].replace(/rmb|\s/g, '')
            }];
          });
          resolve(list);
        } else {
          reject('获取捐赠列表失败');
        }
      });
    })
    .then(list => {
      res.status(200).json({
        statusCode: 200,
        msg: '获取捐赠列表成功',
        data: list
      });
    })
    .catch(err => {
      res.status(404).json({
        statusCode: 404,
        errMsg: '反馈失败'
      });
    });
}