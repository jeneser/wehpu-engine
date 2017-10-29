var crypto = require('crypto');
var config = require('../config');
var HPUVpnLogin = require('../vendor/HPUVpnLogin');
var HPUUrpLogin = require('../vendor/HPUUrpLogin');
var User = require('../models/user');

/**
 * 帐号绑定
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
 * @param {String} [openId] 包含在token中的openId
 * @return {RES} statusCode 201/400 绑定成功/失败
 */
exports.bind = function(req, res, next) {
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
  var nameRe = /<td\swidth="275">\s+([\u4e00-\u9fa5]{2,5})/i;

  if (!studentId && !vpnPassWord && !jwcPassWord && !openId) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  // 认证VPN
  Promise.resolve(
    HPUVpnLogin.login({
      studentId: studentId,
      vpnPassWord: vpnPassWord,
      url: 'https://vpn.hpu.edu.cn/por/service.csp'
    })
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
      return Promise.resolve(
        HPUUrpLogin.login({
          studentId: studentId,
          vpnPassWord: vpnPassWord,
          jwcPassWord: jwcPassWord,
          method: 'get',
          url:
            'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xjInfoAction.do?oper=xjxx'
        })
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
            name = nameRes[1];
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
      // 加密存储
      var cipher = crypto.createCipher(
        config.commonAlgorithm,
        config.commonSecret
      );

      var _vpnPassWord = cipher.update(vpnPassWord, 'utf8', 'hex');
      var _jwcPassWord = cipher.update(jwcPassWord, 'utf8', 'hex');
      var _idNumber = cipher.update(idNumber, 'utf8', 'hex');

      return Promise.resolve(
        User.update(
          {
            openId: openId
          },
          {
            $set: {
              name: name,
              studentId: studentId,
              idNumber: _idNumber,
              vpnPassWord: _vpnPassWord,
              jwcPassWord: _jwcPassWord,
              bind: true
            }
          }
        )
      );
    })
    .then(() => {
      res.status(201).json({
        statusCode: 201,
        errMsg: '绑定成功',
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
