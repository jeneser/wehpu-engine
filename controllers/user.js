var logger = require('../common/logger')
var util = require('../common/util')

var User = require('../models/user')

/**
 * 查询用户信息
 */
exports.user = function (req, res, next) {
  var openId = req.jwtPayload.openId

  if (!openId) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 查询用户
  return Promise.resolve(
      User.findOne({
        openId: openId
      })
    )
    .then(person => {
      if (person) {
        var userInfo = {
          nickName: person.nickName,
          studentId: person.studentId,
          name: person.name,
          bind: person.bind
        }
        return res.status(200).json({
          statusCode: 200,
          errMsg: '查询成功',
          data: userInfo
        })
      } else {
        return res.status(404).json({
          statusCode: 404,
          errMsg: '用户不存在'
        })
      }
    })
    .catch(err => {
      logger.error('获取用户信息失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '查询失败'
      })
    })
}

/**
 * 更新用户信息
 */
exports.update = function (req, res, next) {
  var openId = req.jwtPayload.openId
  var key = req.body.key
  var value = req.body.value

  if (!openId || !key || !value) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 加密存储
  if (key === 'libPassWord') {
    value = util.aesEncrypt(value)
  }

  Promise.resolve(
      User.findOneAndUpdate({
        openId: openId
      }, {
        $set: {
          [key]: value
        }
      }, {
        upsert: false
      })
    )
    .then(doc => {
      if (doc) {
        var userInfo = {
          studentId: doc.studentId
        }
        return res.status(201).json({
          statusCode: 201,
          errMsg: '更新成功',
          data: userInfo
        })
      } else {
        return res.status(400).json({
          statusCode: 400,
          errMsg: '更新失败'
        })
      }
    })
    .catch(err => {
      logger.error('更新用户信息失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '更新失败'
      })
    })
}
