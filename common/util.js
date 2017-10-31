var crypto = require('crypto');
var config = require('../config');
var request = require('superagent');
var cheerio = require('cheerio');
var config = require('../config');

var User = require('../models/user');

// cheerio配置
var cheerioConfig = {
  // True 屏蔽urp不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
};

/**
 * 处理校历信息，确保必定返回信息
 * TODO：自行计算校历
 * @return {Promise} 处理结果
 */
exports.getCalendar = function () {
  return new Promise((resolve, reject) => {
    var calendar = {};

    // 当前学期
    calendar.currentTerm = config.calendar.currentTerm;
    // 开学日期
    calendar.termStart = config.calendar.termStart;
    // 总周数
    calendar.totalWeekly = config.calendar.totalWeekly;

    // 计算当前周次 1: 第一周
    calendar.currentWeekly = (Date.now() > Date.parse(calendar.termStart)) ? calendar.totalWeekly : Math.ceil((Date.now() - Date.parse(calendar.termStart)) / 604800000);

    resolve(calendar);
  });
}

/**
 * 获取用户基本密码信息
 * @return {Promise} 通用密码
 */
exports.getUserInfo = function (openId) {
  // 查询用户
  return new Promise((resolve, reject) => {
    Promise.resolve(
        User.findOne({
          openId: openId
        })
      )
      .then(person => {
        if (person) {
          // 解密
          var decipher = crypto.createDecipher(
            config.commonAlgorithm,
            config.commonSecret
          );

          var userInfo = {
            studentId: person.studentId,
            vpnPassWord: decipher.update(person.vpnPassWord, 'hex', 'utf8'),
            jwcPassWord: decipher.update(person.jwcPassWord, 'hex', 'utf8'),
            idNumber: decipher.update(person.idNumber, 'hex', 'utf8')
          };

          resolve(userInfo);
        } else {
          reject('获取用户信息失败');
        }
      });
  });
}