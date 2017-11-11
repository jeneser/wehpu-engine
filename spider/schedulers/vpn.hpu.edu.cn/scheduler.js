var schedule = require('node-schedule')
var logger = require('../../common/logger')
var config = require('./config')
var main = require('./main')

/**
 * 教务公告定时任务
 * vpn.hpu.edu.cn
 * 星期一/星期三/星期五 凌晨2:30
 */
exports.run = function () {
  schedule.scheduleJob(config.rule, () => {
    var t = new Date()
    logger.info('Started', '教务公告定时任务')

    // 执行主任务
    Promise
      .resolve(main.getNews())
      .then(() => {
        logger.info('Completed', '教务公告定时任务', (new Date() - t) + 'ms')
      })
      .catch(err => {
        if (err.timeout) {
          logger.error('Completed', '教务公告定时任务失败', '网络超时，已结束任务', (new Date() - t) + 'ms')
        } else {
          logger.error('Completed', '教务公告定时任务失败', err, (new Date() - t) + 'ms')
        }
      })
  })
}
