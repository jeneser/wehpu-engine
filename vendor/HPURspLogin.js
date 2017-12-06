/**
 * 模拟登录河南理工大学后勤报修系统
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/jeneser
 */

var request = require('superagent')

var config = {
  // 登录地址
  rspLoginUrl: 'http://houqin.hpu.edu.cn/pc/Account/Login',

  // 通用请求头
  commonHeaders: {
    Host: 'houqin.hpu.edu.cn',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6',
    'Accept-Encoding': 'gzip, deflate',
    Connection: 'keep-alive',
    DNT: '1',
    'Cache-Control': 'max-age=0',
    Referer: 'http://houqin.hpu.edu.cn/pc/Account/login'
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
    // 登录报修系统
    return agent
      .post(config.rspLoginUrl)
      .set(config.commonHeaders)
      .type('form')
      .send({
        UserName: params.studentId,
        Password: params.passWord.toString().substr(-6),
        ReturnUrl: 'http%3a%2f%2fhouqin.hpu.edu.cn%2fpc%2f',
        LoginType: ''
      })
      .timeout({
        response: config.timeout
      })
      .redirects()
      .then(res => {
        // 如果没有url参数则返回agent
        if (params.url === '' || params.url === undefined) {
          return Promise.resolve(agent)
        } else {
          return agent.get(params.url)
        }
      })
  } else {
    Promise.resolve('登录失败')
  }
}
