/**
 * 后勤网配置
 * http://houqin.hpu.edu.cn
 */
var config = {
  // 后勤定时任务规则 星期一 至 星期五 凌晨2:20
  // UTC+8 2:20 > UTC 18:20
  rule: {
    hour: 18,
    minute: 20,
    dayOfWeek: [1, 2, 3, 4, 5]
  },

  // 网络超时 3s
  timeout: 3000,

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

  baseUrl: 'http://houqin.hpu.edu.cn',

  // 后勤公告URL
  url: 'http://houqin.hpu.edu.cn/dsh/Pchome/GetNewsListbySub?RowCount=0&PageIndex=1&PageSize=10&LgType=1&PID=0101',

  // 请求头
  headers: {
    Accept: '*/*',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/53.0.2785.143 Chrome/53.0.2785.143 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    DNT: 1,
    Referer: 'http://houqin.hpu.edu.cn/dsh/Pchome/NewsIndex?NType=01',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-cn'
  }
}

module.exports = config
