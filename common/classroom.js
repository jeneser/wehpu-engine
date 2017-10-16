// 请求资源配置
var agentConfig = {
  url: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=tjcx',
  header: {
    Accept: 'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, */*',
    Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld',
    'Accept-Language': 'zh-CN',
    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
    'Accept-Encoding': 'gzip, deflate',
    Host: 'vpn.hpu.edu.cn',
    Connection: 'Keep-Alive',
    'Cache-Control': 'no-cache'
  },
  commonHeader: {
    Accept: '*/*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0',
    Host: 'vpn.hpu.edu.cn',
    Connection: 'Keep-Alive',
    'Cache-Control': 'no-cache',
    'Accept-Encoding': 'gzip, deflate'
  }
}

/**
 * 处理空教室
 * @param {agent} agent
 * @return {Promise} 处理结果
 */
exports.classroom = function (agent) {
  console.log('开始获取空教室');

  // 南校区和学年
  agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=xszxcx_lb')
    .set({
      Referer: 'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/loginAction.do',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0'
    })
    .type('form')
    .send({
      'zxxnxq': '2016-2017-1-1',
      'zxXaq': '02'
    })
    // 第一步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld')
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=xszxcx_lb',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0'
        })
        .type('form')
        .send({
          'zxJxl': '1'
        })
    })
    // 第二步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xszxcxAction.do?oper=xzzc')
        .set(agentConfig.commonHeader)
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=xszxcx_lb',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0'
        })
        .type('form')
        .send({
          'zc6': '7'
        })
    })
    // 第四步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xszxcxAction.do?oper=xzxq')
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=xszxcx_lb',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0'
        })
        .type('form')
        .send({
          'xq0': '1'
        })
    })
    // 第五步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld&xqh=01&jxlh=1')
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld'
        })
        .type('form')
        .send({
          'zxxnxq': '2016-2017-1-1',
          'zxXaq': '01',
          'zxJxl': '1',
          'zxZc': '6',
          'zxxq': '5',
          'pageSize': '20',
          'page': '1',
          'currentPage': '1'
        })
    })
    // 第六步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xszxcxAction.do?oper=xzjc')
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld'
        })
        .type('form')
        .send({
          'jc+2': '3'
        })
    })
    // 第七步
    .then(() => {
      return agent.post('https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=tjcx')
        .set({
          Referer: 'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.97/xszxcxAction.do?oper=ld&xqh=01&jxlh=1'
        })
        .type('form')
        .send({
          'zxxnxq': '2017-2018-1-1',
          'zxXaq': '01',
          'zxJxl': '18',
          'zxZc': '6',
          'zxxq': '7',
          'zxJc': '9',
          'pageSize': '50',
          'page': '1',
          'currentPage': '1'
        })
        .charset('gbk')
        .then(s7 => {
          console.log('s7:---' + s7.text);
        })
    })
    .catch(err => {
      console.log(err);
    })
}