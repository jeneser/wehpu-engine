var logger = require('../common/logger');

var ignore = /^\/(public)/;

exports = module.exports = function (req, res, next) {
  // 忽略部分路由
  if (ignore.test(req.url)) {
    next();
    return;
  }

  // 输出日志
  var t = new Date();
  logger.level = 'info';
  logger.info('Started', req.method, req.url, req.ip);

  res.on('finish', () => {
    var duration = ((new Date()) - t);

    logger.info('Completed', res.statusCode, '(' + duration + 'ms)');
  });

  next();
};