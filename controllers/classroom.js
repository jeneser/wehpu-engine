var logger = require('../common/logger')
var HPUUrpLogin = require('../vendor/HPUUrpLogin')
var config = require('../config')
var handleClassroom = require('../common/classroom')
var handleUser = require('../common/user')

var Classroom = require('../models/classroom')

exports.classroom = function (req, res, next) {
  var openId = req.jwtPayload.openId

  var building = req.body.building
  var weekly = req.body.weekly
  var section = req.body.section
  var week = req.body.week

  var id = building + weekly + section + week + ''

  // 检验参数
  var validator = (!!building && !!weekly && !!section && !!week) && (parseInt(building) > 0 && parseInt(building) < 19) && (parseInt(weekly) > 0 && parseInt(weekly) < 30) && (parseInt(week) > 0 && parseInt(week) < 8)

  if (!validator) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 从数据库获取空教室数据
  return Promise
    .resolve(Classroom.findOne({
      id: id
    }))
    .then(doc => {
      if (doc && doc.rooms && doc.term === config.calendar.currentTerm) {
        // reject 跳过教务处查询操作直接返回结果
        return Promise.reject(doc)
      }
    })
    // Start: 教务处查询操作
    .then(() => {
      // 查询用户，获取教务资源登录密码
      return Promise
        .resolve(handleUser.getUserInfo(openId))
        .then(userInfo => {
          return Promise.resolve(HPUUrpLogin.login({
            studentId: userInfo.studentId,
            vpnPassWord: userInfo.vpnPassWord,
            jwcPassWord: userInfo.jwcPassWord,
            method: 'post'
          }))
        })
    })
    // 处理空教室
    .then(agent => {
      return Promise.resolve(handleClassroom.classroom({
        agent: agent,
        building: building,
        weekly: weekly,
        section: section,
        week: week
      }))
    })
    // 持久化
    .then(classroomsRes => {
      return Promise.resolve(
        Classroom.findOneAndUpdate({
          id: id
        }, {
          $set: {
            id: id,
            rooms: classroomsRes,
            term: config.calendar.currentTerm
          }
        }, {
          upsert: true
        })
      )
    })
    // End: 转发直接从数据库中获取的数据
    .catch(data => {
      if (data && data.rooms) {
        return Promise.resolve(data)
      }
    })
    .then(data => {
      if (data && data.rooms) {
        return res.status(200).json({
          statusCode: 200,
          errMsg: '获取空教室成功',
          data: data.rooms
        })
      } else {
        return res.status(404).json({
          statusCode: 404,
          errMsg: '无结果'
        })
      }
    })
    .catch(err => {
      logger.error('空教室获取失败' + err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '获取空教室失败'
      })
    })
}
