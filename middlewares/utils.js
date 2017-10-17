var request = require('superagent');
var cheerio = require('cheerio');
var handleUtil = require('../common/util');

/**
 * 校历
 */
exports.requiredCalendar = function (req, res, next) {

  Promise.resolve(handleUtil.calendar())
    .then(calendarRes => {
      // 传递日历
      req.calendar = {
        date: calendarRes.date,
        weekly: calendarRes.weekly,
        totalWeekly: calendarRes.totalWeekly,
        week: calendarRes.week,
        termStart: calendarRes.termStart,
        termEnd: calendarRes.termEnd,
        currentTerm: calendarRes.currentTerm
      }

      next();
    })
    .catch(err => {
      res.status(404).json({
        statusCode: 404,
        errMsg: '校历获取失败'
      });
    })
}