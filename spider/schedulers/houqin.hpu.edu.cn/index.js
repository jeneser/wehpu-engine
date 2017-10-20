var cheerio = require('cheerio');
var async = require('async');
var config = require('./config');
var logger = require('../../common/logger');
var request = require('superagent');
require('superagent-charset')(request);

/**
 * 获取urls
 * @return {Promise} urls 结果数组
 */
function getUrls(flag) {
  // Promise
  return new Promise((resolve, reject) => {
    // URLs
    var urls = [];

    // 发起请求
    request
      .get(config.url)
      .set(config.headers)
      .charset('gbk')
      .then(res => {
        $ = cheerio.load(res.text, config.cheerioConfig);
        // 匹配URLs
        $('a').filter((i, elem) => {
          return $(elem).attr('href').search('/dsh/Pchome/newsInfoDesc') !== -1;
        }).each((i, elem) => {
          // 并入数组
          urls.push($(elem).attr('href'));
        });
        // 返回结果数组
        if (urls.length > 0) {
          // 截取未抓取过的urls
          var _urls = urls.slice(0, urls.findIndex(i => i === flag));
          resolve(_urls);
        } else {
          reject('匹配URLs出错');
        }
      })
      .catch(err => {
        // consol.log(err);
        logger.error('匹配URLs出错:' + err);
        reject('匹配URLs出错');
      });
  });
}

/**
 * 获取文章详情
 * @param {Object} classify 分类URLs
 * @return {Promise} Promise
 */
function getContent(urls) {
  // Promise
  return new Promise((resolve, reject) => {
    // News
    var news = [];

    async.eachLimit(urls, config.limit, (url, cb) => {
      // console.log(url);

      // 发起请求
      request
        .get(config.baseUrl + url)
        .charset('utf8')
        .then(res => {
          $ = cheerio.load(res.text, config.cheerioConfig);

          var _news = {
            // 标题
            title: $('h2', '.title').text().trim(),
            // 内容
            content: $('.Newstxt').html(),
            // 来源作者
            tag: $('a', '.centerrighthead').eq(1).text().trim(),
            // 时间
            time: ($('span', '.title').text()).match(
              /\d{4}(\/)\d{1,2}\1\d{1,2}/)[0].replace(/\//g, '-')
          }

          // 并入结果数组
          news.push(_news);

          // 执行回调
          cb(null);
        })
        .catch(err => {
          // console.log(err);
          logger.error('匹配内容出错:' + err);
        });
    }, err => {
      if (news.length > 0) {
        // 返回抓取结果以及第一条URL
        resolve([news, urls[0]]);
      } else {
        reject('匹配内容出错');
      }
    });
  });
}

exports.getNews = function () {
  // 获取上次匹配进度Flag
  var flag = '/dsh/Pchome/newsInfoDesc/a88b7b95-5a95-4d41-9088-a7f90126e2d9';
  // 获取urls
  Promise.resolve(getUrls(flag))
    // 获取内容
    .then(urls => {
      // console.log(urls);
      return Promise.resolve(getContent(urls));
    })
    // 解构内容以及本次匹配进度
    .then(([newsRes, url]) => {
      console.log(newsRes);
      console.log(url);
    })
    .catch(err => {
      // console.log(err);
      logger.error('后勤网内容抓取失败:' + err);
    });
}