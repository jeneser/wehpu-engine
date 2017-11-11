var cheerio = require('cheerio')

// cheerio配置
var cheerioConfig = {
  // True 屏蔽不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
}

var cleanField = function (elem, i) {
  var field = elem.eq(i).text()
  return field && field.search(/:|：/) ? field.split(/:|：/)[1] : ''
}

exports.physical = function (data) {
  return new Promise((resolve, reject) => {
    var score = []

    var $ = cheerio.load(data, cheerioConfig)

    // 匹配字段
    $('.score-table', 'body').each((i, elem) => {
      var _score = {}
      var _elem = $('td', $(elem))

      // 年度
      _score.year = cleanField(_elem, 0)
      // 身高
      _score.height = cleanField(_elem, 1)
      // 体重
      _score.weight = cleanField(_elem, 2)
      // 肺活量
      _score.vitalCapacity = cleanField(_elem, 3)
      // 跳远
      _score.longJump = cleanField(_elem, 4)
      // 短跑
      _score.sprint = cleanField(_elem, 5)
      // 坐位体前屈
      _score.flexion = cleanField(_elem, 6)
      // 长跑
      _score.longRun = cleanField(_elem, 7)
      // 一分钟引体向上/仰卧起坐
      _score.pullOrSitup = cleanField(_elem, 8)
      // 总分
      _score.totalScore = cleanField(_elem, 9)

      score.push(_score)
    })

    if (score.length) {
      resolve(score)
    } else {
      reject(new Error('处理体测成绩失败'))
    }
  })
}
