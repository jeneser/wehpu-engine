var cheerio = require('cheerio')
var async = require('async')
var config = require('./config')
var logger = require('../../common/logger')
var request = require('superagent')
require('superagent-charset')(request)

var News = require('../../models/news')
var Scheduler = require('../../models/scheduler')

/**
 * 获取urls
 * @param {String} flag 上次匹配位置
 * @return {Promise} urls 结果数组
 */
function getUrls (flag) {
  // Promise
  return new Promise((resolve, reject) => {
    // URLs
    var urls = []

    // 发起请求
    request
      .get(config.url)
      .set(config.headers)
      .charset('gbk')
      .timeout({
        response: config.timeout
      })
      .then(res => {
        var $ = cheerio.load(res.text, config.cheerioConfig)
        // 匹配URLs
        $('a').filter((i, elem) => {
          return $(elem).attr('href').search('http://news.hpu.edu.cn/news/contents/') !== -1
        }).each((i, elem) => {
          // 并入数组
          urls.push($(elem).attr('href'))
        })
        // 返回结果数组
        if (urls.length > 0) {
          // 上次匹配位置
          var index = urls.findIndex(i => i === flag)
          // 截取最新内容
          var _urls = index === -1 ? urls.slice(0) : urls.slice(0, index)

          if (_urls.length === 0) {
            reject(new Error('无最新新闻，已结束本次任务'))
          } else {
            resolve(_urls)
          }
        } else {
          reject(new Error('匹配URLs出错'))
        }
      })
      .catch(err => {
        if (err.timeout) {
          reject(new Error('网络超时，已结束本次任务'))
        } else {
          logger.error('匹配新闻网URLs出错', err)

          reject(new Error('匹配新闻网URLs出错'))
        }
      })
  })
}

/**
 * 获取文章详情
 * @param {Array} urls URLs
 * @return {Promise} 结果，本次匹配位置
 */
function getContent (urls) {
  // Promise
  return new Promise((resolve, reject) => {
    // News
    var news = []

    async.eachLimit(urls, config.limit, (url, cb) => {
      // 发起请求
      request
        .get(url)
        .charset('gbk')
        .then(res => {
          var $ = cheerio.load(res.text, config.cheerioConfig)
          var mainTd = $('td', '#body').attr('width', '700')

          var _news = {
            // 标题
            title: $('.NewsTitle', mainTd).text().trim(),
            // 内容
            content: $('#NewsContent', mainTd).text().replace(/\s/g, '\t').replace(/(&nbsp;){1,}/ig, '\n'),
            // 来源作者
            author: $('tr', mainTd).eq(2).text().search(/供稿人.(.+)发布/) !== -1 ? $('tr', mainTd).eq(2).text().match(/供稿人.(.+)发布/)[1].trim() : '',
            // 时间
            time: $('tr', mainTd).eq(2).text().search(/\d{4}(-)\d{2}\1\d{2}/) !== -1 ? $('tr', mainTd).eq(2).text().match(
              /\d{4}(-)\d{2}\1\d{2}/)[0] : ''
          }

          // 并入结果数组
          news.push(_news)

          // 执行回调
          cb(null)
        })
        .catch(err => {
          logger.error('匹配新闻内容出错', err)
        })
    }, err => {
      if (news.length > 0) {
        // 返回抓取结果以及第一条URL
        resolve([news, urls[0]])
      } else {
        reject(new Error('匹配新闻内容出错' + err))
      }
    })
  })
}

exports.getNews = function () {
  return Scheduler
    // 获取上次匹配进度Flag
    .findOne({
      id: 'news'
    })
    // 获取urls
    .then(doc => {
      var flag = doc ? doc.flag : ''

      return Promise.resolve(getUrls(flag))
    })
    // 获取内容
    .then(urls => {
      return Promise.resolve(getContent(urls))
    })
    // 解构新闻内容以及本次匹配进度
    .then(([newsRes, url]) => {
      // 批量插入新闻结果
      News.collection.insert(newsRes)

      return url
    })
    // 更新匹配进度
    .then(url => {
      return Promise.resolve(Scheduler.findOneAndUpdate({
        id: 'news'
      }, {
        $set: {
          flag: url
        }
      }, {
        upsert: true
      }))
    })
}
