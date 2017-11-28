var config = require('../config')
var request = require('superagent')
var logger = require('../common/logger')

var Token = require('../models/token')

/**
 * 维护全局唯一接口调用凭据 access_token
 */
exports.getAccessToken = function () {
  return Promise.resolve(
    Token.findOne({
      id: 'wxAccessToken'
    }))
    .then(doc => {
      if (doc) {
        var timestamp = doc.timestamp
        var now = Date.now()

        if (now - timestamp > doc.expiresIn) {
          return Promise.resolve()
        } else {
          // 跳过凭证获取
          return Promise.reject(doc)
        }
      }
    })
    // Start: 凭证获取
    .then(() => {
      return request
        .get('https://api.weixin.qq.com/cgi-bin/token')
        .query({
          grant_type: 'client_credential',
          appid: config.appId,
          secret: config.appSecret
        })
    })
    // 持久化
    .then(data => {
      logger.info(data)

      if (data.access_token) {
        return Promise.resolve(
          Token.findOneAndUpdate({
            id: 'wxAccessToken'
          }, {
            $set: {
              id: 'wxAccessToken',
              wxAccessToken: data.access_token
            }
          }, {
            // 返回更新后的文档
            new: true,
            // 强制更新
            upsert: true
          })
        )
      }
    })
    // End: 转发直接从数据库中获取的数据
    .catch(data => {
      if (data) {
        return Promise.resolve(data)
      } else if (Object.prototype.toString.call(data) === '[object Error]') {
        // 转发错误
        return Promise.reject(data)
      }
    })
    // 统一处理
    .then(data => {
      logger.info(data)

      if (data.wxAccessToken) {
        return Promise.resolve(data.wxAccessToken)
      } else {
        return Promise.reject(new Error('获取wxAccessToken异常'))
      }
    })
    .catch(err => {
      logger.error('获取wxAccessToken异常' + err)

      return Promise.reject(err)
    })
}
