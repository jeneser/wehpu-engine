var logger = require('../common/logger')
var util = require('../common/util')

/**
 * 校历
 */
exports.calendar = function (req, res, next) {
  Promise
    .resolve(util.getCalendar())
    .then(calendar => {
      if (calendar) {
        return res.status(200).json({
          statusCode: 200,
          errMsg: '校历获取成功',
          data: {
            // 当前周
            currentWeekly: calendar.weekly,
            // 总周次
            totalWeekly: calendar.totalWeekly,
            // 开学日期
            termStart: calendar.termStart,
            // 当前学期
            currentTerm: calendar.currentTerm
          }
        })
      }
    })
    .catch(err => {
      logger.error('校历获取失败' + err)

      res.status(404).json({
        statusCode: 404,
        errMsg: '校历获取失败'
      })
    })
}
