var config = require('../config');
var WXBizDataCrypt = require('../vendor/WXBizDataCrypt');
var request = require('superagent');

var User = require('../models/user');

/**
 * 用户登录
 * code: 用户登录凭证
 * encryptedData: 包括敏感数据在内的完整用户信息的加密数据
 * iv: 加密算法的初始向量
 */
exports.login = function (req, res, next) {
  var code = req.body.code;
  var encryptedData = req.body.encryptedData;
  var iv = req.body.iv;

  if (!code && !encryptedData && !iv) {
    res.status(400).json({
      code: 400,
      errMsg: '请求格式错误！'
    });
  }

  // 获取sessionKey
  request
    .get(config.jscode2session)
    .query({
      appid: config.appId,
      secret: config.AppSecret,
      js_code: code,
      grant_type: 'authorization_code'
    })
    .then(loginInfo => {
      var loginInfo = JSON.parse(loginInfo.text);

      // 解密用户信息
      var openid = loginInfo.openid;
      var pc = new WXBizDataCrypt(config.appId, loginInfo.session_key);
      var userInfo = pc.decryptData(encryptedData, iv);

      return Promise.resolve(JSON.parse(userInfo));
    })
    .then(userInfo => {
      // 验证用户是否存在
      User.findOne({
        openid: userInfo.openid
      }, (err, person) => {
        if (err) {
          // 不存在，注册并返回绑定信息
          new User({
              openid: userInfo.openid,
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              city: userInfo.city,
              avatarUrl: userInfo.avatarUrl,
              bind: false
            })
            .save()
            .then(val => {
              res.status(201).json({
                code: 201,
                msg: '登录成功',
                data: {
                  bind: false
                }
              });
            });
        } else {
          // 已存在，返回绑定信息
          res.status(200).json({
            code: 200,
            msg: '登录成功',
            data: {
              bind: person.bind
            }
          });
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        code: 500,
        errMsg: '登录出错，请联系开发人员！'
      });
    });
};