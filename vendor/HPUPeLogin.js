/**
 * 模拟登录河南理工大学体测系统
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/jeneser
 */
var logger = require('../common/logger')

var request = require('superagent')

var config = {
  // 登录地址
  peLoginUrl: 'http://218.196.240.158/index.aspx',

  // 通用请求头
  commonHeaders: {
    Host: '218.196.240.158',
    Accept: 'text/html, application/xhtml+xml, image/jxr, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Accept-Language': 'zh-CN',
    'Accept-Encoding': 'gzip, deflate',
    Connection: 'keep-alive',
    DNT: '1',
    'Cache-Control': 'no-cache',
    Referer: 'http://218.196.240.158/index.aspx'
  },

  commonParams: {
    __VIEWSTATE: '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',
    __EVENTVALIDATION: '/wEWBwKlsZmuDQKUj8fhDAK1qbSRCwK3yfbSBALr6+/kCQKQuveTDAKC3IeGDG3QF6YH8dQYa/ubq5May/SQGI+6',
    rblUserType: 'Student',
    btnLogin: '登录'
  },

  // 网络超时
  timeout: 3000
}

/**
 * 模拟登录河南理工大学图书馆系统
 * @param {Object} params
 */
exports.login = function (params) {
  params = params || {}

  // 保存Cookie
  var agent = request.agent()

  if (params.studentId && params.passWord) {
    agent
      .post(config.peLoginUrl)
      .set(config.commonHeaders)
      .type('form')
      .send(config.commonParams)
      .send({
        // 学号
        txtAccount: params.studentId,
        // 身份证后八位
        txtPassword: params.passWord.toString().substr(-8)
      })
      .timeout({
        response: config.timeout
      })
      .redirects()
      .then(res => {
        logger.info('res:' + res)

        // 如果没有url参数则返回agent
        if (params.url === '' || params.url === undefined) {
          return Promise.resolve(agent)
        } else {
          return agent.get(params.url)
        }
      })
  } else {
    Promise.reject(new Error('登录失败'))
  }
}
