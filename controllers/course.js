var logger = require('../common/logger')
var HPUUrpLogin = require('../vendor/HPUUrpLogin')
var handleCourse = require('../common/course')
var handleUser = require('../common/user')
var config = require('../config')

var Course = require('../models/course')

exports.course = function (req, res, next) {
  var openId = req.jwtPayload.openId

  // 验证
  if (!openId) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 从数据库获取课表数据
  return Promise
    .resolve(Course.findOne({
      openId: openId
    }))
    .then(doc => {
      if (doc && doc.courses && doc.term === config.currentTerm) {
        // reject 跳过教务处查询操作直接返回结果
        return Promise.reject(doc)
      }
    })
    // Start: 教务处查询操作
    .then(() => {
      // 查询用户，获取教务资源登录密码
      return Promise.resolve(handleUser.getUserInfo(openId))
    })
    // 登录教务处并获取课表资源
    .then(userInfo => {
      return Promise.resolve(
        HPUUrpLogin.login({
          studentId: userInfo.studentId,
          vpnPassWord: userInfo.vpnPassWord,
          jwcPassWord: userInfo.jwcPassWord,
          method: 'get',
          url: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xkAction.do?actionType=6'
        })
      )
    })
    // 测试是否访问成功
    .then(urpContent => {
      if (/选课结果/.test(urpContent.text)) {
        return Promise.resolve(urpContent.text)
      } else {
        return Promise.reject(new Error('访问失败'))
      }
    })
    // 处理课表
    .then(data => {
      return Promise.resolve(handleCourse.course(data))
    })
    // 解构参数，持久化
    .then(([originCourses, processedCourses]) => {
      // 持久化经过处理的课表
      return Promise.resolve(
        Course.findOneAndUpdate({
          openId: openId
        }, {
          $set: {
            openId: openId,
            courses: processedCourses,
            term: config.currentTerm
          }
        }, {
          upsert: true
        })
      )
    })
    // End: 转发直接从数据库中获取的数据
    .catch(data => {
      if (data && data.courses) {
        return Promise.resolve(data)
      }
    })
    // 返回
    .then(data => {
      if (data && data.courses) {
        return res.status(200).json({
          statusCode: 200,
          errMsg: '获取课表成功',
          data: data.courses
        })
      } else {
        return res.status(404).json({
          statusCode: 404,
          errMsg: '无结果'
        })
      }
    })
    // 处理错误
    .catch(err => {
      logger.error('获取课表失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '获取课表失败'
      })
    })
}
