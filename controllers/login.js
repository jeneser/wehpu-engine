var config = require('../config');
var WXBizDataCrypt = require('../vendor/WXBizDataCrypt');
var request = require('superagent');

/**
 * 用户登录
 * code: 用户登录凭证
 * encryptedData: 包括敏感数据在内的完整用户信息的加密数据
 * iv: 加密算法的初始向量
 */
exports.login = function(req, res, next) {
  var code = req.body.code;
  var encryptedData = req.body.encryptedData;
  var iv = req.body.iv;

  // 获取sessionKey
  request
    .get(config.jscode2session)
    .query({
      appid: config.appId,
      secret: config.AppSecret,
      js_code: code,
      grant_type: 'authorization_code'
    })
    .then(res => {
      // 解密用户信息
      var openid = res.openid;
      var pc = new WXBizDataCrypt(config.appId, res.session_key);
      var data = pc.decryptData(encryptedData, iv);

      // return {
      //   openid: openid,
      //   data: data
      // }
      res.status(200).json({
        data: data,
        openid: openid
      });
    });
};
