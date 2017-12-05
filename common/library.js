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

// 清理字段信息
var cleanField = function (elem, index) {
  return elem.eq(index).text().trim().replace(/(&nbsp;){1,}/ig, '')
}

/**
 * 处理图书信息
 * @param {*} data 页面原始内容
 */
exports.borrowing = function (data) {
  return new Promise((resolve, reject) => {
    var books = []
    var $ = cheerio.load(data, cheerioConfig)

    $('tr')
      .filter((i, elem) => {
        return $(elem).attr('align') === 'left'
      })
      .each((i, elem) => {
        var book = {}
        var td = $('span', $(elem))

        // 是否可续借
        book.renew = cleanField(td, 0) === '可续借'
        // 书名
        book.name = $('a', $(elem)).text().trim()
        // 馆藏地
        book.place = cleanField(td, 1)
        // 馆藏号
        book.number = cleanField(td, 0)
        // 续借次数
        book.times = cleanField(td, 2)
        // 借书时间
        book.start = cleanField(td, 3)
        // 应还日期
        book.end = cleanField(td, 4)
        // 超期情况
        book.remain = cleanField(td, 5)

        books.push(book)
      })

    resolve(books)
  })
}

/**
 * 处理搜索结果
 * @param {Object} data 页面原始内容
 */
exports.books = function (data) {
  return new Promise((resolve, reject) => {
    var books = []
    var $ = cheerio.load(data, cheerioConfig)
    var table = $('#ctl00_ContentPlaceHolder1_GridView1')
    $('table', $(table))
      .each((i, elem) => {
        var book = {}

        var a = $('a', $(elem))
        var span = $('span', $(elem))

        // 书名
        book.title = a.text()
        // id
        book.id = a.attr('href').split('=')[1]
        // 索书号
        book.callNumber = cleanField(span, 1)
        // 作者
        book.author = cleanField(span, 3)
        // 出版社
        book.publisher = cleanField(span, 5)

        books.push(book)
      })

    resolve(books)
  })
}

/**
 * 处理单个图书结果
 * @param {Object} data 页面原始内容
 */
exports.book = function (data) {
  return new Promise((resolve, reject) => {
    var freeBooks = []
    var $ = cheerio.load(data, cheerioConfig)
    var table = $('#ctl00_ContentPlaceHolder1_GridView1')

    $('tr', $(table))
      .filter((i, elem) => {
        return $(elem).attr('align') === 'left'
      })
      .each((i, elem) => {
        var freeBook = {}
        var td = $('td', $(elem))

        // 馆藏位置
        freeBook.place = cleanField(td, 0)
        // 借出时间
        freeBook.start = cleanField(td, 3)
        // 到期时间
        freeBook.end = cleanField(td, 4)
        // 是否可借 1 可借 0 不可借
        freeBook.state = cleanField(td, 5) === '可借' ? 1 : 0

        freeBooks.push(freeBook)
      })

    resolve(freeBooks)
  })
}
