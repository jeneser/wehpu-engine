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
function getUrls() {
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
          return $(elem).attr('href').search('http://news.hpu.edu.cn/news/contents/') !== -1;
        }).each((i, elem) => {
          // 并入数组
          urls.push($(elem).attr('href'));
        });
        // 返回结果数组
        if (urls.length > 0) {
          resolve(urls);
        } else {
          logger.error('匹配新闻网URLs出错');
          reject('匹配URLs出错');
        }
      })
      .catch(err => {
        consol.log(err);
        logger.error('匹配新闻网URLs出错');
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
      request
        .get(url)
        .charset('gbk')
        .then(res => {
          $ = cheerio.load(res.text, config.cheerioConfig);
          var mainTd = $('td').attr('width', '700');
          var mateTd = $('td', mainTd).attr('height', '40');

          var _news = {
            // 标题
            title: $('.NewsTitle', mainTd).text().trim(),
            // 来源作者
            author: mateTd.eq(1).match(/供稿人.(.+)发布/)[1],
            // 时间
            time: mateTd.eq(1).text().search(/\d{4}(-)\d{2}\1\d{2}/) !== -1 ? mateTd.eq(1).text().match(
              /\d{4}(-)\d{2}\1\d{2}/)[0] : '',
            // 标签
            tag: $('a', mateTd.eq(0)).eq(1).text().trim(),
            // 内容
            content: $('#NewsContent', mainTd).html(),
            // 图片
            pictures: ''
          }

          // 并入结果数组
          news.push(_news);
          cb(null, 1);
        })
        .catch(err => {
          // 忽略错误
        });
    }, err => {
      if (news.length > 0) {
        resolve(news);
      } else {
        reject('匹配新闻网内容出错');
      }
    });
  });
}

exports.getNews = function () {

  // 获取urls
  Promise.resolve(getUrls())
    // 获取内容
    .then(urls => {
      return Promise.resolve(getContent(urls));
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}