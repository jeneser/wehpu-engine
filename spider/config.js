var config = {
  // 日志
  log4js: {
    // 文件名
    filename: 'logs/spider-all.log',
    // 10M
    maxLogSize: 10485760,
    // 保留三个备份
    backups: 3
  }
}

module.exports = config;