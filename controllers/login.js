var config = require('../config');
var WXBizDataCrypt = require('../vendor/WXBizDataCrypt');
var request = require('superagent');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

/**
 * 用户登录
 * @param {*} code 用户登录凭证
 * @param {*} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @param {*} iv 加密算法的初始向量
 * @return {*} bind token
 */
exports.login = function(req, res, next) {
  var code = req.body.code;
  var encryptedData = req.body.encryptedData;
  var iv = req.body.iv;

  if (!code && !encryptedData && !iv) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '请求格式错误'
    });
  }

  // 获取sessionKey
  request
    .get(config.jscode2session)
    .query({
      appid: config.appId,
      secret: config.appSecret,
      js_code: code,
      grant_type: 'authorization_code'
    })
    .then(loginInfo => {
      var loginInfo = JSON.parse(loginInfo.text);

      // 解密用户信息
      var openId = loginInfo.openId;
      var pc = new WXBizDataCrypt(config.appId, loginInfo.session_key);
      var userInfo = pc.decryptData(encryptedData, iv);

      return userInfo;
    })
    .then(userInfo => {
      // 验证用户是否存在
      User.findOne(
        {
          openId: userInfo.openId
        },
        (err, person) => {
          if (err) {
            res.status(500).json({
              statusCode: 500,
              errMsg: '登录出错，请联系开发人员'
            });
          }

          // 生成会话token，有效期15天
          var token = jwt.sign(
            {
              openId: userInfo.openId,
              nickName: userInfo.nickName
            },
            config.jwtSecret,
            {
              expiresIn: '15d'
            }
          );

          if (!person) {
            // 不存在，注册并返回绑定信息和token
            new User({
              openId: userInfo.openId,
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              city: userInfo.city,
              avatarUrl: userInfo.avatarUrl,
              bind: false
            })
              .save()
              .then(() => {
                res.status(201).json({
                  statusCode: 201,
                  msg: '登录成功',
                  data: {
                    bind: false,
                    token: token
                  }
                });
              });
          } else {
            // 已存在，返回绑定信息和token
            res.status(200).json({
              statusCode: 200,
              msg: '登录成功',
              data: {
                bind: person.bind,
                token: token
              }
            });
          }
        }
      );
    })
    .catch(() => {
      res.status(500).json({
        statusCode: 500,
        errMsg: '登录出错，请联系开发人员'
      });
    });
};
