var request = require('superagent')
var logger = require('../common/logger')
var config = require('../config')

/**
 * 反馈
 * @param {Json} {} 请求数据
 * @param {String} content 内容
 * @param {String} labels 标签
 * @param {String} nick 用户名
 * @param {String} model 手机型号
 * @param {String} platform 手机平台
 * @param {String} wxVersion 微信版本号
 * @param {String} wehpuVersion wehpu版本号
 * @param {String} images 图片urls ,分割
 * @return {String} url 反馈链接
 */
exports.feedback = function (req, res, next) {
  var data = req.body

  // 验证
  if (!data.content || data.content.length < 5 || !data.labels || !data.nick || !data.model || !data.platform || !data.wxVersion || !data.wehpuVersion) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  // 遍历图片
  var _images = ''
  if (data.images) {
    data.images.split(',').forEach(url => {
      _images += '![img](' + url + '?x-oss-process=style/feedback' + ')\r\n'
    })
  }

  // 拼接内容
  var _content = {
    // 标题
    title: '[ ' + data.nick + ' ] ' + '来自wehpu客户端的问题反馈',
    // 内容
    body: data.content + '\r\n\r\n' + '------' + '\r\n' +
      '用户名: ' + data.nick + '\r\n' +
      '手机型号: ' + data.model + ' ' + data.platform + '\r\n' +
      '微信版本: ' + data.wxVersion + '\r\n' +
      'Wehpu版本: ' + data.wehpuVersion + '\r\n\r\n' +
      _images,
    // 标签
    labels: data.labels.split(',')
  }

  // 发起请求
  request
    .post('https://api.github.com/repos/hpufe/wehpu/issues')
    .set({
      'Authorization': 'Bearer ' + config.githubToken
    })
    .send(_content)
    .then(result => {
      var _result = JSON.parse(result.text)

      return new Promise((resolve, reject) => {
        if (_result.id && _result.url) {
          resolve(_result)
        } else {
          reject(new Error('反馈失败'))
        }
      })
    })
    .then(result => {
      return res.status(201).json({
        statusCode: 201,
        errMsg: '反馈成功',
        data: {
          url: result.html_url
        }
      })
    })
    .catch(err => {
      logger.error(err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '反馈失败'
      })
    })
}
