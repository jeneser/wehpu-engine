var cheerio = require('cheerio');

/**
 * 处理本学期成绩
 * @param {*} data 原始结果页面html源码
 * @return {Promise} scores 处理结果
 */
exports.score = function (data) {
  // 结果数组
  var scores = [];

  // cheerio配置
  var cheerioConfig = {
    // True 屏蔽urp不规范源码
    xmlMode: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    ignoreWhitespace: true
  };

  // Promise
  return new Promise((resolve, reject) => {
    // 处理课表
    $ = cheerio.load(data, cheerioConfig);

    // step1 获取包含课表的<table>块
    var step1 = $('#user').html();

    console.log('s1:' + step1);
  });
}