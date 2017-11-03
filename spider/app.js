var jNews = require('./schedulers/news.hpu.edu.cn/scheduler');
var jLogistics = require('./schedulers/houqin.hpu.edu.cn/scheduler');
var jNotices = require('./schedulers/vpn.hpu.edu.cn/scheduler');

exports.run = function () {
  /**
   * 新闻网定时任务
   * news.hpu.edu.cn
   * 星期一 至 星期五 凌晨2:00
   */
  jNews.run();

  /**
   * 后勤定时任务
   * houqin.hpu.edu.cn
   * 星期一 至 星期五 凌晨2:20
   */
  jLogistics.run();

  /**
   * 教务公告定时任务
   * vpn.hpu.edu.cn
   * 星期一/星期三/星期五 凌晨2:30
   */
  jNotices.run();
}