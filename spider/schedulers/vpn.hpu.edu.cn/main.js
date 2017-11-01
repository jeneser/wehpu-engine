var fs = fs = require('fs');
var cheerio = require('cheerio');
var async = require('async');
var config = require('./config');
var logger = require('../../common/logger');
var HPUVpnLogin = require('../../vendor/HPUVpnLogin');
var request = require('superagent');
require('superagent-charset')(request);

/**
 * 获取讲座信息
 * @param {*} data 页面源码
 * @param {String} flag 上次抓取进度
 * @return {Promise} Promise [res, preRes]
 */
function getLecture(data, flag) {
  return new Promise((resolve, reject) => {
    var lectures = [];

    $ = cheerio.load(data, config.cheerioConfig);
    $('tr').filter((i, elem) => {
      return $(elem).attr('align') === 'left';
    }).each((i, elem) => {
      // console.log($(elem).text());
      var div = $('div', elem);

      var lecture = {
        // 标题
        title: $('span', div.eq(1)).eq(1).text().trim(),
        // 主讲人
        speaker: $('span', div.eq(2)).eq(1).text().trim(),
        // 时间
        time: $('span', div.eq(3)).eq(1).text().trim(),
        // 地点
        place: $('span', div.eq(3)).eq(2).text().trim(),
        // 内容
        content: $('span', div.eq(4)).eq(1).text().trim()
      }

      // 并入结果数组
      lectures.push(lecture);
    });

    if (lectures.length > 0) {
      var _lectures = lectures.slice(0, lectures.findIndex(i => i.title === flag));
      // console.log(_lectures);
      // 返回抓取结果以及第一条URL
      resolve([_lectures, lectures[0].title]);
    } else {
      reject('匹配内容出错');
    }
  })
}

/**
 * 获取最新公告
 * @param {*} data 页面源码
 * @param {String} flag 上次抓取进度
 * @return {Promise} Promise
 */
function getNoticeUrls(data, flag) {
  return new Promise((resolve, reject) => {
    // 最新公告URLs
    var urls = [];

    $ = cheerio.load(data, config.cheerioConfig);

    // 匹配URLs
    $('a', '.panes div div span').each((i, elem) => {
      // 并入数组
      urls.push($(elem).attr('href'));
    });

    if (urls.length > 0) {
      var _urls = urls.slice(0, urls.findIndex(i => i === flag));
      // console.log(_lectures);
      // 返回抓取结果以及第一条URL
      resolve([_urls, urls[0]]);
    } else {
      reject('匹配内容出错');
    }
  })
}

/**
 * 下载最新公告
 * @param {Array} urls urls
 * @return {Promise} Promise
 */
function downloadNotice(agent, urls) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream('./my.doc');

    var req = agent
      .get(config.baseUrl + urls[0])
      .redirects(1)
      .pipe(stream);
  });
}

exports.getNews = function () {
  var lectures = [];
  var notice = [];

  var source = '';

  var flags = {
    lecture: '天空海一体化卫星重力反演和水下组合导航研究',
    notice: ''
  }

  var _agent = '';

  // 登录VPN
  return Promise.resolve(HPUVpnLogin.login(config.userInfo))
    .then(agent => {
      _agent = agent;

      return agent.get(config.commonUrl);
    })
    .then(vpnRes => {
      // 暂存源码
      source = vpnRes.text;

      // 下一步，获取讲座信息
      return Promise.resolve(getLecture(source, flags.lecture));
    })
    .then(([lectureRes, flag]) => {
      // 暂存讲座信息
      lectures = lectureRes;
      // console.log(lectures);

      // 下一步，获取最新公告urls
      return Promise.resolve(getNoticeUrls(source, flags.notice));
    })
    .then(([noticeUrls, flag]) => {
      // console.log(noticeUrls);
      // console.log(flag);

      // 下一步，下载最新公告
      return Promise.resolve(downloadNotice(_agent, noticeUrls));
      // console.log(noticeUrls);
    })
    .catch(err => {
      console.log(err);
    });

}