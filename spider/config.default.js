var config = {
  debug: true,

  // mongodb
  mongodb: 'mongodb://mongodb-master:27017,mongodb-slave1:27017,mongodb-slave2:27017/wehpu?replicaSet=wehpu',

  // 通用加密算法 需妥善保管!
  commonAlgorithm: '',

  // 通用密钥 需妥善保管!
  commonSecret: '',

  // 最大上传尺寸 20M > 20971520 bytes
  limitUploadSize: 20971520,

  // 日志
  log4js: {
    // 文件名
    filename: 'logs/spider-cheese.log',
    // 10M
    maxLogSize: 10485760,
    // 保留三个备份
    backups: 3
  },

  // 阿里云OSS
  aliOSS: {
    region: 'oss-cn-shanghai',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: 'wehpu-engine'
  },

  // 校内资源认证帐号 加密存储
  userInfo: {
    studentId: '',
    vpnPassWord: ''
  }
}

module.exports = config
