var config = require('../config');
var cheerio = require('cheerio');
var logger = require('../common/logger');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleClassroom = require('../common/classroom');
var handleUser = require('../common/user');

var User = require('../models/user');

/**
 * 查询空教室
 * @param {String} building 教学楼
 * @param {String} weekly 周次
 * @param {String} section 节次
 * @param {String} week 周
 * @param {String} [openId] 包含在token中的openId
 */
exports.classroom = function (req, res, next) {
  var openId = req.jwtPayload.openId;

  var building = req.body.building;
  var weekly = req.body.weekly;
  var section = req.body.section;
  var week = req.body.week;

  // 检验参数
  var _section = section.split(',');
  var validator = (!!building && !!weekly && !!section && !!week) && (parseInt(building) > 0 && parseInt(building) < 19) && (parseInt(weekly) > 0 && parseInt(weekly) < 30) && (parseInt(week) > 0 && parseInt(week) < 8) && (parseInt(section) > 0 && parseInt(section) < 11);

  if (!validator) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  // 查询用户，获取教务资源登录密码
  Promise
    .resolve(handleUser.getUserInfo(openId))
    .then(userInfo => {
      return Promise.resolve(HPUUrpLogin.login({
        studentId: userInfo.studentId,
        vpnPassWord: userInfo.vpnPassWord,
        jwcPassWord: userInfo.jwcPassWord,
        method: 'post'
      }))
    })
    .then(agent => {
      return Promise.resolve(handleClassroom.classroom({
        agent: agent,
        building: building,
        weekly: weekly,
        section: section,
        week: week
      }));
    })
    .then(classroomsRes => {
      res.status(200).json({
        statusCode: 200,
        errMsg: '获取空教室成功',
        data: classroomsRes
      });
    })
    .catch(err => {
      logger.error('空教室获取失败' + err);

      res.status(404).json({
        statusCode: 404,
        errMsg: '获取空教室失败'
      });
    })
}