var cheerio = require('cheerio');
var logger = require('../common/logger');

// cheerio配置
var cheerioConfig = {
  // True 屏蔽不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
};

// 清理字段信息
var cleanField = function (elem, index) {
  return elem.eq(index).text().trim();
}

/**
 * 处理图书信息
 * @param {*} data 页面原始内容
 */
exports.borrowing = function (data) {
  return new Promise((resolve, reject) => {
    var books = [];
    $ = cheerio.load(data, cheerioConfig);

    $('tr')
      .filter((i, elem) => {
        return $(elem).attr('align') === 'left';
      })
      .each((i, elem) => {
        var book = {};
        var td = $('span', $(elem));

        // 是否可续借
        book.renew = cleanField(td, 0) === '可续借' ? true : false;
        // 书名
        book.name = $('a', $(elem)).text().trim();
        // 馆藏号
        book.number = cleanField(td, 1);
        // 馆藏地
        book.place = cleanField(td, 2);
        // 续借次数
        book.times = cleanField(td, 3);
        // 借书时间
        book.start = cleanField(td, 4);
        // 应还日期
        book.end = cleanField(td, 5);
        // 超期情况
        book.start = cleanField(td, 6);

        books.push(book);
      });

    if (books.length) {
      resolve(books);
    } else {
      reject('处理借阅信息失败');
    }
  })
}