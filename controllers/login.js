var config = require('../config')
var WXBizDataCrypt = require('../vendor/WXBizDataCrypt')
var request = require('superagent')
var jwt = require('jsonwebtoken')
var logger = require('../common/logger')

var User = require('../models/user')

exports.login = function (req, res, next) {
  var code = req.body.code
  var encryptedData = req.body.encryptedData
  var iv = req.body.iv

  if (!code && !encryptedData && !iv) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 获取sessionKey
  return request
    .get(config.jscode2session)
    .query({
      appid: config.appId,
      secret: config.appSecret,
      js_code: code,
      grant_type: 'authorization_code'
    })
    // 获取用户信息
    .then(loginInfo => {
      var _loginInfo = JSON.parse(loginInfo.text)

      // 解密用户信息
      var pc = new WXBizDataCrypt(config.appId, _loginInfo.session_key)
      var userInfo = pc.decryptData(encryptedData, iv)

      return userInfo
    })
    // 确认用户信息
    .then(userInfo => {
      return Promise.resolve(
        User.findOneAndUpdate({
          openId: userInfo.openId
        }, {
          $set: {
            openId: userInfo.openId,
            nickName: userInfo.nickName,
            gender: userInfo.gender,
            city: userInfo.city,
            avatarUrl: userInfo.avatarUrl,
            bind: false
          }
        }, {
          upsert: true
        })
      )
    })
    // 返回会话
    .then(doc => {
      // 生成会话token
      var token = jwt.sign(
        {
          openId: doc.openId,
          nickName: doc.nickName
        },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiresIn
        }
      )

      return res.status(200).json({
        statusCode: 200,
        errMsg: '获取token成功',
        data: {
          bind: doc.bind,
          token: token
        }
      })
    })
    .catch(err => {
      logger.error('获取token出错' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '获取token出错'
      })
    })
}
