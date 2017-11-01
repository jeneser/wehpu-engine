var schedule = require('node-schedule');
var logger = require('../../common/logger');
var config = require('./config');
var main = require('./main');

/**
 * 新闻网定时任务
 * news.hpu.edu.cn
 * 星期一 至 星期五 凌晨2:00
 */
module.exports = function () {
  return schedule.scheduleJob(config.rule, () => {
    var t = new Date();
    logger.info('Started', '新闻网定时任务', t.toISOString());

    // 执行主任务
    Promise
      .resolve(main.getNews())
      .then(() => {
        logger.info('Completed', '新闻网定时任务', (new Date() - t) + 'ms');
      })
      .catch(err => {
        logger.error('Completed', '新闻网定时任务失败:' + err);
      });
  });
}