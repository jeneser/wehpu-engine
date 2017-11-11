var schedule = require('node-schedule')
var logger = require('../../common/logger')
var config = require('./config')
var main = require('./main')

/**
 * 后勤定时任务
 * houqin.hpu.edu.cn
 * 星期一 至 星期五 凌晨2:20
 */
exports.run = function () {
  schedule.scheduleJob(config.rule, () => {
    var t = new Date()
    logger.info('Started', '后勤定时任务')

    // 执行主任务
    Promise
      .resolve(main.getNews())
      .then(() => {
        logger.info('Completed', '后勤定时任务', (new Date() - t) + 'ms')
      })
      .catch(err => {
        logger.error('Completed', '后勤定时任务失败', err, (new Date() - t) + 'ms')
      })
  })
}
