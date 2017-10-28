/**
 * 后勤网配置
 * http://houqin.hpu.edu.cn
 */
var config = {

  // 妥善保管用户账户
  userInfo: {
    studentId: '311509040120',
    vpnPassWord: '211219'
  },

  // cheerio配置
  cheerioConfig: {
    // True 屏蔽不规范源码
    xmlMode: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    ignoreWhitespace: true
  },

  // 限制最大并发数量
  limit: 5,

  baseUrl: 'https://vpn.hpu.edu.cn',

  // 最新公告和讲座
  commonUrl: 'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.155/swfweb/hpugg.aspx',

  // 通用请求头
  commonHeader: {
    Host: 'vpn.hpu.edu.cn',
    Accept: '*/*',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/53.0.2785.143 Chrome/53.0.2785.143 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    Connection: 'Keep-Alive',
    Referer: 'http://houqin.hpu.edu.cn/dsh/Pchome/NewsIndex?NType=01',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN'
  }
}

module.exports = config;