var cheerio = require('cheerio')
var util = require('../common/util')

// 请求资源配置
var agentConfig = {
  commonHeader: {
    Host: 'vpn.hpu.edu.cn',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0',
    Connection: 'Keep-Alive'
  }
}

// cheerio配置
var cheerioConfig = {
  // True 屏蔽urp不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
}

/**
 * 处理空教室
 * @param {Object} params
 * @return {Promise} 处理结果
 */
exports.classroom = function (params) {
  return new Promise((resolve, reject) => {
    var agent = params.agent
    // 结果
    var classrooms = []

    // 获取当前学期
    Promise
      .resolve(util.getCalendar())
      .then(calendar => {
        params.currentTerm = calendar.currentTerm
      })
      .then(() => {
        // 必要的试探性请求
        return agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=xszxcx_lb')
          .set(agentConfig.commonHeader)
          .set({
            Referer: 'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/loginAction.do'
          })
          .type('form')
          .send({
            'zxxnxq': params.currentTerm,
            'zxXaq': '01'
          })
      })
      // 发起请求
      .then(() => {
        return agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=tjcx')
          .set(agentConfig.commonHeader)
          .set({
            Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld&xqh=01&jxlh=18'
          })
          .type('form')
          .send({
            'zxxnxq': params.currentTerm,
            'zxXaq': '01',
            'zxJxl': params.building,
            'zxZc': params.weekly,
            'zxxq': params.week,
            'zxJc': params.section,
            'pageSize': '100',
            'page': '1',
            'currentPage': '1'
          })
          .charset('gbk')
      })
      // 处理空教室
      .then(urpContent => {
        // console.log(urpContent);

        // 处理空教室信息
        var $ = cheerio.load(urpContent.text, cheerioConfig)

        // step1 获取包含空教室的<table>块
        var userElem = $('#user').html()

        // 获取教室列表
        var _$ = cheerio.load(userElem, cheerioConfig)
        _$('tr')
          .filter((i, elem) => {
            return $(elem).attr('class') === 'even' || $(elem).attr('class') === 'odd'
          })
          .each((i, elem) => {
            var q = $(elem).children('td')

            classrooms.push({
              // 教学楼
              building: q.eq(2).text().trim(),
              // 教室
              room: q.eq(3).text().replace('(多)', '').trim(),
              // 教室容量
              volume: q.eq(5).text().trim()
            })
          })

        if (classrooms.length > 0) {
          resolve(classrooms)
        } else {
          reject(new Error('处理空教室出错'))
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
