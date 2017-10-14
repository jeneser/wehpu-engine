var crypto = require('crypto');
var config = require('../config');
var cheerio = require('cheerio');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');

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
  var validator = (!!building && !!weekly && !!section && !!week) && (parseInt(building) > 0 && parseInt(building) < 19) && (parseInt(weekly) > 0 && parseInt(weekly) < 30) && (parseInt(week) > 0 && parseInt(week) < 8) && section.search(',') !== -1;

  if (!validator) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  var currentYear = config.schoolYear.split('-')[0];
  // 学年，EG: 秋季：2017-2018-1-1 春季：2017-2018-2-1
  var zxxnxq = currentYear + '-' + (parseInt(currentYear) + 1) + '-' + config.schoolTerm + '-1';

  // 查询参数
  var classroomParams = {
    // 用户输入
    building: building,
    weekly: weekly,
    section: section,
    week: week,
    // 学年
    zxxnxq: zxxnxq,
    // 南校区
    zxXaq: 01,
    // 页码参数，结果全部显示在第一页
    pageSize: 200,
    page: 1,
    currentPage: 1,
    pageNo: ''
  }

  // 请求资源配置
  var agentConfig = {
    url: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=tjcx',
    header: {
      Host: 'vpn.hpu.edu.cn',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld&xqh=01&jxlh=',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    }
  }

  // 访问资源
  // Promise.resolve(
  //     User.findOne({
  //       openId: openId
  //     })
  //   )
  //   .then(person => {
  //     if (person) {
  //       // 解密
  //       var decipher = crypto.createDecipher(
  //         config.commonAlgorithm,
  //         config.commonSecret
  //       );

  //       var userInfo = {
  //         studentId: person.studentId,
  //         vpnPassWord: decipher.update(person.vpnPassWord, 'hex', 'utf8'),
  //         jwcPassWord: decipher.update(person.jwcPassWord, 'hex', 'utf8')
  //       };

  //       return userInfo;
  //     } else {
  //       res.status(403).json({
  //         statusCode: 403,
  //         errMsg: '空教室查询失败'
  //       });
  //     }
  //   })
  //   .then(() => {
  //     return Promise.resolve(HPUUrpLogin.login(userInfo.studentId,
  //       userInfo.vpnPassWord,
  //       userInfo.jwcPassWord, 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=tjcx'))
  //   })

  var userInfo = {
    studentId: '311509040120',
    vpnPassWord: '211219',
    jwcPassWord: '311509040120'
  }

  Promise.resolve(HPUUrpLogin.login({
      studentId: userInfo.studentId,
      vpnPassWord: userInfo.vpnPassWord,
      jwcPassWord: userInfo.jwcPassWord,
      url: agentConfig.url,
      method: 'post'
    }))
    .set(agentConfig.header)
    .type('form')
    .send(classroomParams)
    .redirects()

    // 测试是否访问成功
    .then(urpContent => {
      console.log(urpContent.text);
      // return new Promise((resolve, reject) => {
      //   if (/选课结果/.test(urpContent.text)) {
      //     resolve(urpContent.text);
      //   } else {
      //     reject('访问失败');
      //   }
      // });
    })
    .catch(err => {
      console.log(err);
    })
  // 处理课表
  // .then(data => {
  //   return Promise.resolve(handleCourse.course(data));
  // })

}