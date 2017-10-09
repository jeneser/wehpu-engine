var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var handleCourse = require('../common/course');

// var Course = require('../models/course');

/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
exports.course = function (req, res, next) {
  // var openId = req.jwtPayload.openId;

  // if (!openId) {
  //   res.status(400).json({
  //     statusCode: 400,
  //     errMsg: '请求格式错误！'
  //   })
  // }

  // 查询用户，获取教务资源登录密码
  // User.findOne({
  //     openId: openId
  //   })
  //   .then(person => {
  //     if (person) {
  //       var userInfo = {
  //         studentId: person.studentId,
  //         vpnPassWord: person.vpnPassWord,
  //         jwcPassWord: person.jwcPassWord
  //       }

  //       return userInfo;
  //     } else {
  //       res.status(403).json({
  //         statusCode: 403,
  //         errMsg: '课表查询失败'
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       statusCode: 500,
  //       errMsg: '用户不存在'
  //     });
  //   })

  var studentId = '311509040120';
  var vpnPassWord = '211219';
  var jwcPassWord = '311509040120';

  // 登录教务处并获取课表资源
  HPUUrpLogin.login(
      studentId,
      vpnPassWord,
      jwcPassWord,
      'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xkAction.do?actionType=6'
    )
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
      res.json({
        data: handleCourse.course(data)
      })
    })
    // 处理错误
    .catch(err => {
      console.log(err);
    })

}