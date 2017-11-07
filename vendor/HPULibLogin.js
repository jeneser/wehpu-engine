/**
 * 模拟登录河南理工大学图书馆系统
 */

var request = require('superagent');
var logger = require('../common/logger');

var config = {
  // 登录地址
  libLoginUrl: 'http://218.196.244.90:8080/OutLogin.aspx?kind=2',

  // 通用请求头
  commonHeaders: {
    Host: '218.196.244.90:8080',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6',
    'Accept-Encoding': 'gzip, deflate',
    Connection: 'keep-alive',
    DNT: '1',
    'Cache-Control': 'max-age=0',
    Referer: 'http://lib.hpu.edu.cn/mylib.html'
  }
}

/**
 * 模拟登录河南理工大学图书馆系统
 * @param {Object} params
 */
exports.login = function (params) {
  var params = params || {};

  // 保存Cookie
  var agent = request.agent();

  if (params.studentId && params.passWord) {
    // 登录图书馆
    return agent
      .post(config.libLoginUrl)
      .set(config.commonHeaders)
      .type('form')
      .send({
        userid: params.studentId,
        password: params.passWord
      })
      .redirects()
      .then(res => {
        // 如果没有url参数则返回agent
        if (params.url === '' || params.url === undefined) {
          return Promise.resolve(agent);
        } else {
          return agent.get(params.url);
        }
      });
  } else {
    Promise.resolve('登录失败');
  }
}