var cheerio = require('cheerio');

// cheerio配置
var cheerioConfig = {
  // True 屏蔽urp不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
};

/**
 * 处理本学期成绩
 * @param {*} data 原始结果页面html源码
 * @return {Promise} scores 处理结果
 */
exports.score = function (data) {
  // 结果数组
  var scores = [];

  // Promise
  return new Promise((resolve, reject) => {
    // 处理成绩
    $ = cheerio.load(data, cheerioConfig);

    // 处理成绩列表
    $('.odd', $('#user')).each((i, elem) => {
      var score = {};
      var td = $('td', elem);

      // 课程号
      score.number = td.eq(0).text().trim();
      // 课程名
      score.name = td.eq(2).text().trim();
      // 最高分
      score.highest = td.eq(6).text().trim();
      // 最低分
      score.lowest = td.eq(7).text().trim();
      // 平均分
      score.average = td.eq(8).text().trim();
      // 分数
      score.mark = td.eq(9).text().trim();
      // 排名
      score.rank = td.eq(10).text().trim();

      scores.push(score);

      if (scores.length > 0) {
        resolve(scores);
      } else {
        reject('处理成绩出错');
      }
    });
  });
}