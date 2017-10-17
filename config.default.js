/**
 * 全局配置
 * 部署到服务端时，请去掉文件名中的default
 * 并将以下参数配置完整，重要信息请妥善保管
 */
var config = {
  // port
  port: process.env.PORT || '3000',

  // mongodb
  mongodb:
    'mongodb://mongodb-master:27017,mongodb-slave1:27017,mongodb-slave2:27017/wehpu?replicaSet=wehpu',

  // 小程序ID 需妥善保管!
  appId: '',

  // 小程序密钥 需妥善保管!
  appSecret: '',

  // code换取session_key接口
  jscode2session: 'https://api.weixin.qq.com/sns/jscode2session',

  // json web token 需妥善保管!
  jwtSecret: '',

  // 通用加密算法 需妥善保管!
  commonAlgorithm: '',

  // 通用密钥 需妥善保管!
  commonSecret: '',

  // 阿里云OSS 需妥善保管!
  aliOSS: {
    region: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  }
};

module.exports = config;
