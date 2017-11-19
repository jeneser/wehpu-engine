var logger = require('../common/logger')
var HPUUrpLogin = require('../vendor/HPUUrpLogin')
var handleScore = require('../common/score')
var handleUser = require('../common/user')
var config = require('../config')

var Score = require('../models/score')

/**
 * 合并并去重两个数组
 * @param  {Array} left 待合并数组
 * @param  {Array} right 待合并数组
 * @param  {String} key 唯一键
 * @return {Array} 合并结果
 */
function mergArray (left, right, key) {
  var merged = left
  right.forEach(r => {
    var ele = left.find(l => {
      return l[key] === r[key]
    })
    if (!ele) {
      merged.push(r)
    }
  })
  return merged
}

/**
 * 查询本学期成绩
 */
exports.score = function (req, res, next) {
  var openId = req.jwtPayload.openId

  // 从数据库获取数据
  var fromDb = new Promise((resolve, reject) => {
    Promise
      .resolve(Score.findOne({
        openId: openId
      }))
      .then(doc => {
        if (doc && doc.scores && doc.term === config.calendar.currentTerm) {
          resolve(doc.scores)
        } else {
          resolve([])
        }
      })
      .catch(err => {
        logger.error(err)

        resolve([])
      })
  })

  // 从教务系统获取
  var fromUrp = new Promise((resolve, reject) => {
    // 查询用户，获取教务资源登录密码
    Promise.resolve(handleUser.getUserInfo(openId))
      // 查询本学期成绩
      .then(userInfo => {
        return Promise.resolve(HPUUrpLogin.login({
          studentId: userInfo.studentId,
          vpnPassWord: userInfo.vpnPassWord,
          jwcPassWord: userInfo.jwcPassWord,
          method: 'get',
          url: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/bxqcjcxAction.do'
        }))
      })
      .then(urpContent => {
        var _urpContent = urpContent.text

        if (/本学期成绩/.test(_urpContent)) {
          resolve(handleScore.score(_urpContent))
        } else {
          resolve([])
        }
      })
      .catch(err => {
        logger.error(err)

        // 跳过错误处理
        resolve([])
      })
  })

  Promise
    .all([fromDb, fromUrp])
    .then(data => {
      // 合并结果
      return mergArray(data[0], data[1])
    })
    // 持久化
    .then(data => {
      return Promise.resolve(
        Score.update({
          openId: openId
        }, {
          $set: {
            scores: data
          }
        }, {
          upsert: true
        })
      )
    })
    // 返回结果
    .then(doc => {
      if (doc && doc.scores) {
        return res.status(200).json({
          statusCode: 200,
          errMsg: '成绩查询成功',
          data: doc.scores
        })
      } else {
        return res.status(404).json({
          statusCode: 404,
          errMsg: '无结果'
        })
      }
    })
    .catch(err => {
      logger.error('成绩查询失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '成绩查询失败'
      })
    })
}
