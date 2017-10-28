var config = require('../config');
var log4js = require('log4js');

log4js.configure({
  appenders: {
    engine: {
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
  }
});

var logger = log4js.getLogger('engine');
logger.setLevel(config.debug ? 'DEBUG' : 'ERROR');

module.exports = logger;