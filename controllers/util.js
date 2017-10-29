var handleUtil = require('../common/util');

/**
 * 校历
 */
exports.calendar = function (req, res, next) {
  var calendar = req.calendar;

  if (Object.keys(calendar).length) {
    res.status(200).json({
      errMsg: '校历获取成功',
      data: {
        date: calendar.date,
        weekly: calendar.weekly,
        totalWeekly: calendar.totalWeekly,
        week: calendar.week,
        termStart: calendar.termStart,
        termEnd: calendar.termEnd,
        currentTerm: calendar.currentTerm
      }
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      errMsg: '校历获取失败'
    });
  }

}