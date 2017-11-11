var logger = require('../common/logger')
var HPUUrpLogin = require('../vendor/HPUUrpLogin')
var handleCourse = require('../common/course')
var handleUser = require('../common/user')

var Course = require('../models/course')

/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
exports.course = function (req, res, next) {
  var openId = req.jwtPayload.openId

  // 验证
  if (!openId) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 查询用户，获取教务资源登录密码
  Promise
    .resolve(handleUser.getUserInfo(openId))
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
      return new Promise((resolve, reject) => {
        if (/选课结果/.test(urpContent.text)) {
          resolve(urpContent.text)
        } else {
          reject(new Error('访问失败'))
        }
      })
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
            courses: processedCourses
          }
        }, {
          upsert: true
        })
      )
    })
    // 返回
    .then(doc => {
      res.status(201).json({
        statusCode: 201,
        errMsg: '获取课表成功',
        data: doc.courses
      })
    })
    // 处理错误
    .catch(err => {
      logger.error('获取课表失败' + err)

      res.status(404).json({
        statusCode: 404,
        errMsg: '获取课表失败'
      })
    })
}
