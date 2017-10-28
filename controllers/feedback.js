var logger = require('./common/logger');

/**
 * 反馈
 */
exports.feedback = function() {
  logger.info('测试测试');
  
  res.status(404).json({
    statusCode: 404,
    errMsg: '反馈失败'
  });
}