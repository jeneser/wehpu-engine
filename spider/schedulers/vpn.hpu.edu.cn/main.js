var fs = fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var cheerio = require('cheerio');
var async = require('async');
var uuidv4 = require('uuid/v4');
var globalConfig = require('../../config');
var config = require('./config');
var logger = require('../../common/logger');
var HPUVpnLogin = require('../../vendor/HPUVpnLogin');
var util = require('../../common/util');
var fileUpload = require('../../common/upload');
var request = require('superagent');
require('superagent-charset')(request);

var Lecture = require('../../models/lecture');
var Scheduler = require('../../models/scheduler');

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
        content: $('span', div.eq(4)).eq(1).text().replace(/\s/g, '\t').replace(/(&nbsp;){1,}/ig, '\n')
      }

      // 并入结果数组
      lectures.push(lecture);
    });

    if (lectures.length > 0) {
      // 上次匹配位置
      var index = lectures.findIndex(i => i.title === flag);
      // 截取最新内容
      var _lectures = index === -1 ? lectures.slice(0) : lectures.slice(0, index);

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
      // 上次匹配位置
      var index = urls.findIndex(i => i === flag);
      // 截取最新内容
      var _urls = index === -1 ? urls.slice(0) : urls.slice(0, index);

      if (_urls.length) {
        // 返回抓取结果以及第一条URL
        resolve([_urls, urls[0]]);
      } else {
        reject('无最新公告，已结束本次任务');
      }
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

    // for (let i; i < urls.length; i++) {
    //   let fileName
    // }


    // 获取文件类型
    agent
      .get(config.baseUrl + urls[0])
      .redirects(1)
      // 下载文件到本地
      .then(res => {
        return new Promise((resolve, reject) => {
          // 文件名
          var fileName = uuidv4();
          // 后缀 TODO
          var suffix = '.' + util.mimeToExt(res.type);
          // 临时文件路径
          var tmpPath = path.join(__dirname, '../../tmpdir/', fileName + suffix);
          // 写流
          var writeStream = fs.createWriteStream(tmpPath);

          // 请求资源
          agent
            .get(config.baseUrl + urls[0])
            .redirects(1)
            .pipe(writeStream);

          // 监听状态
          writeStream.on('close', () => {
            // 返回临时路径，mime类型
            resolve([tmpPath, res.type]);
          });
          writeStream.on('error', () => {
            reject('保存本地失败');
          })
        });
      })
      // 上传OSS
      .then(([tmpPath, mime]) => {
        logger.info(tmpPath);

        return Promise.resolve(fileUpload.upload({
          folder: 'notice',
          file: tmpPath,
          mime: mime
        }));
      })
      .then(url => {
        logger.info('OSS地址', url);
      })
      .catch(err => {
        logger.error(err);

        reject('over');
      });
  });
}

exports.getNews = function () {
  // 未经处理的源码
  var source = '';

  // 上次匹配进度
  var flags = {
    lecture: '',
    notice: ''
  }

  // 共享Cookies
  var _agent = '';

  // 解密用户信息
  var userInfo = {
    studentId: util.aesDecrypt(globalConfig.userInfo.studentId),
    vpnPassWord: util.aesDecrypt(globalConfig.userInfo.vpnPassWord)
  };

  // 登录VPN
  return Promise.resolve(HPUVpnLogin.login(userInfo))
    .then(agent => {
      _agent = agent;

      return agent.get(config.commonUrl);
    })
    .then(vpnRes => {
      // 暂存源码
      source = vpnRes.text;
    })
    // // 获取上次匹配进度Flag
    .then(() => {
      return Scheduler
        .findOne({
          id: 'lecture'
        })
        .then(doc => {
          var flag = doc ? doc.flag : '';

          flags.lecture = flag;
        })
    })
    .then(() => {
      return Scheduler
        .findOne({
          id: 'notice'
        })
        .then(doc => {
          var flag = doc ? doc.flag : '';

          flags.notice = flag;
        })
    })
    // 下一步，获取讲座信息
    .then(() => {
      return Promise.resolve(getLecture(source, flags.lecture));
    })
    .then(([lectureRes, flag]) => {
      if (lectureRes.length) {
        // 批量插入讲座结果
        Lecture.collection.insert(lectureRes);

        // 更新本次进度
        return Promise.resolve(Scheduler.findOneAndUpdate({
          id: 'lecture'
        }, {
          $set: {
            flag: flag
          }
        }, {
          upsert: true
        }));
      }
    })
    // 下一步，获取最新公告urls
    .then(() => {
      return Promise.resolve(getNoticeUrls(source, flags.notice));
    })
    // 下一步，下载最新公告
    .then(([noticeUrls, flag]) => {
      // 暂存公告flag
      flags.notice = flag;

      return Promise.resolve(downloadNotice(_agent, noticeUrls));
    })
}