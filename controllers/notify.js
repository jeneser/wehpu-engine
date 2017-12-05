var request = require('superagent')
var logger = require('../common/logger')
var config = require('../config')
var token = require('../common/token')

var User = require('../models/user')

/**
 * 发送模板消息
 * @param {String} studentId 学号
 * @param {String} templateId 消息模板id
 * @param {String} formId 表单id
 * @param {String} data 模板消息内容
 */
exports.notify = function (req, res, next) {
  var params = req.body

  if (!params.studentId) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  // 模板数据
  var msgData = {
    // 接收者openId
    touser: '',
    // 模板id
    template_id: config.templateId[params.templateId],
    // 表单id
    form_id: params.formId,
    // 模板内容
    data: params.data,
    // 需要放大的关键词
    emphasis_keyword: 'keyword2.DATA'
  }

  // 查询用户是否注册
  Promise.resolve(
      User.find({
        studentId: params.studentId
      })
    )
    .then(person => {
      if (person) {
        logger.info(person)
        // 确定接受者id
        msgData.touser = person.openId
      } else {
        return Promise.reject(new Error('用户不存在'))
      }
    })
    // 获取access_token
    .then(() => {
      return token.getAccessToken()
    })
    .then(accessToken => {
      logger.info(JSON.stringify(msgData))
      // 发送模板消息
      return request
        .post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + accessToken)
        .send(JSON.stringify(msgData))
    })
    .then(data => {
      if (data.body.errcode === 0) {
        return res.status(200).json({
          statusCode: 200,
          errMsg: '发送成功'
        })
      } else {
        logger.info(data)

        return res.status(400).json({
          statusCode: 400,
          errMsg: '发送失败'
        })
      }
    })
    .catch(err => {
      logger.error(err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '内部错误'
      })
    })
}
