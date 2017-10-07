var HPUVpnLogin = require('../vendor/HPUVpnLogin');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var User = require('../models/user');

/**
 * 帐号绑定
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
 * @param {String} [openId] 包含在token中的openId
 */
exports.binding = function(req, res, next) {
  var studentId = req.body.studentId;
  var vpnPassWord = req.body.vpnPassWord;
  var jwcPassWord = req.body.jwcPassWord;
  var openId = req.jwtPayload.openId;

  // 认证状态
  var authState = {
    vpn: false,
    jwc: false
  };
  // 身份证号
  var idNumber = '';
  // 姓名
  var name = '';
  // 正则
  var idNumberRe = /\d{17}[\d|x]|\d{15}/i;
  var nameRe = /<TD width=275>[\u4e00-\u9fa5]{2,5}/i;

  if (!studentId && !vpnPassWord && !jwcPassWord && !openId) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  // 认证VPN
  HPUVpnLogin.login(
    studentId,
    vpnPassWord,
    'https://vpn.hpu.edu.cn/por/service.csp'
  )
    // 测试是否访问成功
    .then(serviceContent => {
      return new Promise((resolve, reject) => {
        if (/欢迎您/.test(serviceContent.text)) {
          resolve('访问成功');
        } else {
          reject('访问失败');
        }
      });
    })
    .then(() => {
      authState.vpn = true;
    })
    // 认证URP
    .then(() => {
      return HPUUrpLogin.login(
        studentId,
        vpnPassWord,
        jwcPassWord,
        'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xjInfoAction.do?oper=xjxx'
      );
    })
    .then(urpContent => {
      // 匹配<学籍信息>关键字
      return new Promise((resolve, reject) => {
        var data = urpContent.text;

        if (/学籍信息/.test(data)) {
          // 匹配身份证号
          var idNumberRes = data.match(idNumberRe);
          if (idNumberRes !== null) {
            idNumber = idNumberRes[0];
          }
          // 匹配姓名
          var nameRes = data.match(nameRe);
          if (nameRes !== null) {
            name = nameRes[0];
          }

          resolve('访问成功');
        } else {
          reject('访问失败');
        }
      });
    })
    .then(() => {
      authState.jwc = true;
    })
    // 更新绑定信息
    .then(() => {
      return User.update(
        {
          openId: openId
        },
        {
          $set: {
            // TODO: 加密存储
            name: name,
            idNumber: idNumber,
            studentId: studentId,
            vpnPassWord: vpnPassWord,
            jwcPassWord: jwcPassWord,
            bind: true
          }
        }
      );
    })
    .then(() => {
      res.status(201).json({
        statusCode: 201,
        msg: '绑定成功',
        data: authState
      });
    })
    .catch(err => {
      res.status(400).json({
        statusCode: 400,
        errMsg: '认证失败',
        data: authState
      });
    });
};
