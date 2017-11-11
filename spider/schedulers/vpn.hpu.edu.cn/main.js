var fs = require('fs')
var path = require('path')
var cheerio = require('cheerio')
var async = require('async')
var uuidv4 = require('uuid/v4')
var globalConfig = require('../../config')
var config = require('./config')
var logger = require('../../common/logger')
var HPUVpnLogin = require('../../vendor/HPUVpnLogin')
var util = require('../../common/util')
var fileUpload = require('../../common/upload')
var request = require('superagent')
require('superagent-charset')(request)

var Lecture = require('../../models/lecture')
var Notice = require('../../models/notice')
var Scheduler = require('../../models/scheduler')

/**
 * 获取讲座信息
 * @param {*} data 页面源码
 * @param {String} flag 上次抓取进度
 * @return {Promise} Promise [res, preRes]
 */
function getLecture (data, flag) {
  return new Promise((resolve, reject) => {
    var lectures = []

    var $ = cheerio.load(data, config.cheerioConfig)
    $('tr').filter((i, elem) => {
      return $(elem).attr('align') === 'left'
    }).each((i, elem) => {
      var div = $('div', elem)

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
        content: $('span', div.eq(4)).eq(1).text().replace(/\s/g, '\t').replace(/(&nbsp;){1,}/ig, '\n')
      }

      // 并入结果数组
      lectures.push(lecture)
    })

    if (lectures.length > 0) {
      // 上次匹配位置
      var index = lectures.findIndex(i => i.title === flag)
      // 截取最新内容
      var _lectures = index === -1 ? lectures.slice(0) : lectures.slice(0, index)

      // 返回抓取结果以及第一条URL
      resolve([_lectures, lectures[0].title])
    } else {
      reject(new Error('匹配内容出错'))
    }
  })
}

/**
 * 获取最新公告
 * @param {*} data 页面源码
 * @param {String} flag 上次抓取进度
 * @return {Promise} Promise
 */
function getNoticeUrls (data, flag) {
  return new Promise((resolve, reject) => {
    // 最新公告URLs
    var urls = []

    var $ = cheerio.load(data, config.cheerioConfig)

    // 匹配URL和公告标题
    $('a', '.panes div div span').each((i, elem) => {
      // 并入数组
      urls.push({
        href: $(elem).attr('href'),
        title: $(elem).text().trim()
      })
    })

    if (urls.length > 0) {
      // 上次匹配位置
      var index = urls.findIndex(i => i.href === flag)
      // 截取最新内容
      var _urls = index === -1 ? urls.slice(0) : urls.slice(0, index)

      if (_urls.length) {
        // 返回抓取结果以及第一条URL
        resolve([_urls, urls[0].href])
      } else {
        reject(new Error('无最新公告，已结束本次任务'))
      }
    } else {
      reject(new Error('匹配内容出错'))
    }
  })
}

/**
 * 下载最新公告
 * @param {Array} urls urls
 * @return {Promise} Promise
 */
function downloadNotice (agent, urls) {
  return new Promise((resolve, reject) => {
    if (!urls.length) {
      reject(new Error('无最新资源，已结束任务'))
    }

    // 处理结果
    var notices = []

    async.eachSeries(urls, (item, cb) => {
      var notice = {}

      notice.title = item.title

      // 获取文件类型
      agent
        .get(config.baseUrl + item.href)
        .redirects(1)
        // 处理结果
        .then(res => {
          return new Promise((resolve, reject) => {
            // 抓取网页内容 text/html
            if (/text\/html/.test(res.type.toLowerCase())) {
              var $ = cheerio.load(res.text, config.cheerioConfig)

              // 资源内容
              var content = $('#Label3', 'body').text().replace(/\s/g, '\t').replace(/(&nbsp;){1,}/ig, '\n')

              // 解构 [临时路径, 文本内容, mime类型]
              resolve(['', content, ''])
            } else {
              // 文件后缀转换
              var _suffix = util.mimeToExt(res.type)
              // 前缀文件名
              var fileName = 'prefix-notice-' + uuidv4()
              // 后缀
              var suffix = '.' + (_suffix || 'unknown')
              // 临时文件路径
              var tmpPath = path.join(__dirname, '../../tmpdir/', fileName + suffix)
              // 写流
              var writeStream = fs.createWriteStream(tmpPath)

              // 判断文件合法性
              if (+res.header['content-length'] > +config.limitUploadSize || util.filterMime(res.type) === false) {
                // 移除临时文件
                util.unlink(tmpPath)

                resolve([''])
              } else {
                // 请求资源
                agent
                  .get(config.baseUrl + item.href)
                  .redirects(1)
                  .pipe(writeStream)

                // 监听状态
                writeStream.on('close', () => {
                  // 解构 [临时路径, 文本内容, mime类型, 文件大小]
                  resolve([tmpPath, '', res.type, res.header['content-length']])
                })
                writeStream.on('error', () => {
                  resolve([''])
                })
              }
            }
          })
        })
        // 上传至OSS
        .then(([tmpPath, content, mime, filesize]) => {
          return new Promise((resolve, reject) => {
            if (tmpPath && mime && filesize) {
              // 上传文件
              Promise.resolve(fileUpload.upload({
                folder: 'notice',
                file: tmpPath,
                mime: mime,
                filesize: filesize,
                limit: config.limitUploadSize
              }))
                .then(ossUrl => {
                  if (ossUrl) {
                    // 文件存储位置
                    notice.href = ossUrl
                    notice.content = ''

                    notices.push(notice)

                    cb(null)
                  }
                })
                .catch(err => {
                  logger.error('非法文件，已跳过', err)

                  // 置空
                  notice.href = ''
                  notice.content = ''

                  notices.push(notice)

                  cb(null)
                })
            } else if (content) {
              // 公告网页内容
              notice.content = content
              notice.href = ''

              notices.push(notice)

              cb(null)
            } else {
              notice.content = ''
              notice.href = ''

              notices.push(notice)

              cb(null)
            }
          })
        })
        .catch(err => {
          logger.error('处理教务公告出错', err)

          cb(err)
        })
    }, err => {
      if (err) {
        logger.error('处理教务公告出错', err)
      } else if (notices.length) {
        resolve(notices)
      } else {
        reject(new Error('无最新内容，已结束本次任务'))
      }
    })
  })
}

exports.getNews = function () {
  // 未经处理的源码
  var source = ''

  // 上次匹配进度
  var flags = {
    lecture: '',
    notice: ''
  }

  // 共享Cookies
  var _agent = ''

  // 解密用户信息
  var userInfo = {
    studentId: util.aesDecrypt(globalConfig.userInfo.studentId),
    vpnPassWord: util.aesDecrypt(globalConfig.userInfo.vpnPassWord)
  }

  // 登录VPN
  return Promise.resolve(HPUVpnLogin.login(userInfo))
    .then(agent => {
      // 暂存cookie
      _agent = agent

      // 请求教务公告列表
      return agent.get(config.commonUrl)
    })
    .then(vpnRes => {
      // 暂存源码资源
      source = vpnRes.text
    })
    // 获取上次讲座匹配进度Flag
    .then(() => {
      return Scheduler
        .findOne({
          id: 'lecture'
        })
        .then(doc => {
          var flag = doc ? doc.flag : ''

          flags.lecture = flag
        })
    })
    // 获取上次公告匹配进度Flag
    .then(() => {
      return Scheduler
        .findOne({
          id: 'notice'
        })
        .then(doc => {
          var flag = doc ? doc.flag : ''

          flags.notice = flag
        })
    })
    // 下一步，获取讲座信息
    .then(() => {
      return Promise.resolve(getLecture(source, flags.lecture))
    })
    // 讲座信息入库
    .then(([lectureRes, flag]) => {
      if (lectureRes.length) {
        // 批量插入讲座结果
        Lecture.collection.insert(lectureRes)

        // 更新本次进度
        return Promise.resolve(Scheduler.findOneAndUpdate({
          id: 'lecture'
        }, {
          $set: {
            flag: flag
          }
        }, {
          upsert: true
        }))
      }
    })
    // 下一步，获取最新公告urls
    .then(() => {
      return Promise.resolve(getNoticeUrls(source, flags.notice))
    })
    // 下一步，下载最新公告
    .then(([noticeUrls, flag]) => {
      // 暂存公告flag
      flags.notice = flag

      return Promise.resolve(downloadNotice(_agent, noticeUrls))
    })
    // 最新公告入库
    .then(noticesRes => {
      if (noticesRes.length) {
        // 批量插入公告结果
        Notice.collection.insert(noticesRes)

        // 更新本次进度
        return Promise.resolve(Scheduler.findOneAndUpdate({
          id: 'notice'
        }, {
          $set: {
            flag: flags.notice
          }
        }, {
          upsert: true
        }))
      }
    })
}
