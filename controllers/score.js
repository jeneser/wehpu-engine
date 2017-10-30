var crypto = require('crypto');
var config = require('../config');
var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleScore = require('../common/score');
var util = require('../common/util');

var User = require('../models/user');

/**
 * 查询本学期成绩
 * @param {String} [openId] 包含在token中的openId
 */
exports.score = function (req, res, next) {
  var openId = req.jwtPayload.openId;

  // 查询用户，获取教务资源登录密码
  Promise
    .resolve(util.getUserInfo(openId))
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
      var _urpContent = urpContent.text;
      if (/本学期成绩/.test(_urpContent)) {
        return Promise.resolve(handleScore.score(_urpContent));
      } else {
        return Promise.reject('访问失败');
      }
    })
    .then(scoreRes => {
      res.status(200).json({
        statusCode: 200,
        errMsg: '成绩查询成功',
        data: scoreRes
      });
    })
    .catch(err => {
      res.status(404).json({
        statusCode: 404,
        errMsg: '成绩查询失败'
      });
    });
}