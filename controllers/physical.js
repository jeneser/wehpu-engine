var logger = require('../common/logger')
var HPUPeLogin = require('../vendor/HPUPeLogin')
var handleUser = require('../common/user')
var handlePhysical = require('../common/physical')

exports.physical = function (req, res, next) {
  var openId = req.jwtPayload.openId

  // 查询用户，获取教务资源登录密码
  Promise
    .resolve(handleUser.getUserInfo(openId))
    .then(userInfo => {
      logger.info(userInfo)

      return Promise.resolve(HPUPeLogin.login({
        // 学号
        studentId: userInfo.studentId,
        // 身份证后八位
        passWord: userInfo.idNumber.toString().slice(-8),
        url: 'http://218.196.240.158/welcome.aspx'
      }))
    })
    .then(content => {
      return Promise.resolve(handlePhysical.physical(content.text))
    })
    .then(data => {
      return res.status(200).json({
        statusCode: 200,
        errMsg: '查询成功',
        data: data
      })
    })
    .catch(err => {
      logger.error('体测成绩查询失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '查询失败'
      })
    })
}
