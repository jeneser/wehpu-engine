/**
 * 全局配置
 * 部署到服务端时，请去掉文件名中的default
 * 并将以下参数配置完整，重要信息请妥善保管
 */
var config = {
  // 调试模式
  debug: false,

  // port
  port: '3000',

  // mongodb
  mongodb: 'mongodb://mongodb-master:27017,mongodb-slave1:27017,mongodb-slave2:27017/wehpu?replicaSet=wehpu',

  // 小程序ID 需妥善保管!
  appId: '',

  // 小程序密钥 需妥善保管!
  appSecret: '',

  // code换取session_key接口
  jscode2session: 'https://api.weixin.qq.com/sns/jscode2session',

  // 微信模板消息id
  templateId: {
    // 校园卡找回通知
    AT1107: '0aCdZ9Yf7D5u7-uZeOsWzf7Zv2UX9ySkqBfIxhKeTns'
  },

  // json web token 需妥善保管!
  jwtSecret: '',

  // 会话有效期
  jwtExpiresIn: '15d',

  // 通用加密算法 需妥善保管!
  commonAlgorithm: '',

  // 通用密钥 需妥善保管!
  commonSecret: '',

  // 阿里云OSS
  aliOSS: {
    region: 'oss-cn-shanghai',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: 'wehpu-engine'
  },

  // github token 需妥善保管!
  githubToken: '',

  // 最大上传尺寸 20M > 20971520 bytes
  limitUploadSize: 20971520,

  // 日志
  log4js: {
    // 文件名
    filename: 'logs/engine-cheese.log',
    // 10M
    maxLogSize: 10485760,
    // 回滚三个备份
    backups: 3
  },

  // 校历
  calendar: {
    // 当前学期 秋季:2017-2018-1-1 春季:2017-2018-2-1
    currentTerm: '2017-2018-1-1',
    // 开学日期
    termStart: '2017-9-4',
    // 放假日期
    termEnd: '2018-1-22',
    // 总周次
    totalWeekly: 20
  }
}

module.exports = config
