var crypto = require('crypto');
var config = require('../config');
var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleScore = require('../common/score');

var User = require('../models/user');

/**
 * 查询本学期成绩
 * @param {String} [openId] 包含在token中的openId
 */
exports.score = function (req, res, next) {
  var openId = req.jwtPayload.openId;

  // TODO:抽离中间件
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
          jwcPassWord: decipher.update(person.jwcPassWord, 'hex', 'utf8')
        };

        return userInfo;
      } else {
        res.status(403).json({
          statusCode: 403,
          errMsg: '成绩查询失败'
        });
      }
    })
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
      // console.log(urpContent);
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
      // console.log(err);
    });
}