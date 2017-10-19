var config = require('../config');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function () {
  log4js.configure({
    appenders: {
      spider: {
        type: 'file',
        // 存储位置
        filename: config.log4js.filename,
        // 尺寸上限
        maxLogSize: config.log4js.maxLogSize,
        // 备份
        backups: config.log4js.backups,
        // 压缩
        compress: true
      }
    },
    categories: {
      default: {
        appenders: ['spider'],
        level: 'debug'
      }
    }
  });

  return logger;
}