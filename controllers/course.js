var crypto = require('crypto');
var config = require('../config');
var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleCourse = require('../common/course');

var Course = require('../models/course');
var User = require('../models/user');

/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
exports.course = function (req, res, next) {
  var openId = req.jwtPayload.openId;

  if (!openId) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    })
  }

  // 查询用户，获取教务资源登录密码
  User.findOne({
      openId: openId
    })
    .then(person => {
      if (person) {
        // 解密
        var decipher = crypto.createDecipher(config.commonAlgorithm, config.commonSecret);

        var userInfo = {
          studentId: person.studentId,
          vpnPassWord: decipher.update(person.vpnPassWord, 'hex', 'utf8'),
          jwcPassWord: decipher.update(person.jwcPassWord, 'hex', 'utf8')
        }

        return userInfo;
      } else {
        res.status(403).json({
          statusCode: 403,
          errMsg: '课表查询失败'
        });
      }
    })
    // 登录教务处并获取课表资源
    .then(userInfo => {
      return HPUUrpLogin.login(
        userInfo.studentId,
        userInfo.vpnPassWord,
        userInfo.jwcPassWord,
        'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xkAction.do?actionType=6'
      );
    })
    // 测试是否访问成功
    .then(urpContent => {
      return new Promise((resolve, reject) => {
        if (/选课结果/.test(urpContent.text)) {
          resolve(urpContent.text);
        } else {
          reject('访问失败');
        }
      });
    })
    // 处理课表
    .then(data => {
      return handleCourse.course(data);
    })
    // 持久化
    .then(([originCourses, processedCourses]) => {
      return new Course({
        openId: openId,
        courses: processedCourses,
        originCourses: originCourses
      }).save();
    })
    // 返回
    .then(doc => {
      res.status(201).json({
        statusCode: 201,
        msg: '获取课表成功',
        data: doc.courses
      });
    })
    // 处理错误
    .catch(err => {
      res.status(404).json({
        statusCode: 404,
        errMsg: '获取课表失败'
      });
    })

}