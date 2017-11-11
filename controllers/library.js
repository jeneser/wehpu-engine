var request = require('superagent')
var logger = require('../common/logger')
var HPULibLogin = require('../vendor/HPULibLogin')
var handleLibrary = require('../common/library')

/**
 * 图书借阅信息
 */
exports.borrowing = function (req, res, next) {
  // 登录图书馆获取借阅信息
  Promise
    .resolve(HPULibLogin.login({
      studentId: '311509040120',
      passWord: '311509040120',
      url: 'http://218.196.244.90:8080/Borrowing.aspx'
    }))
    .then(libRes => {
      return Promise.resolve(handleLibrary.borrowing(libRes.text))
    })
    .then(books => {
      res.status(200).json({
        statusCode: 200,
        errMsg: '获取成功',
        data: books
      })
    })
    .catch(err => {
      logger.error('获取借阅信息失败', err)

      res.status(500).json({
        statusCode: 500,
        errMsg: '获取失败'
      })
    })
}

/**
 * 图书借阅信息
 * @param {String} q 查询关键字
 */
exports.books = function (req, res, next) {
  var q = req.query.q
  var id = req.params.id

  // 处理查询结果列表
  if (q) {
    var searchParams = 'http://218.196.244.90:8080/SearchResult.aspx?KindOfSearch=1&FieldToSort=0&DirectionOfSort=DESC&StoreAtWhere=ALL&CountOfPage=30&SecSerchKey=&SecSerchWord=&Titlie=' + encodeURI(q.substr(0, 15)) + '&PYM=&ZTFL=&SSH=&ZRZ=&ISBN=&CSM=&CBS=&ZTC=&ZDY=&LAN=0'

    request
      .get(searchParams)
      .then(libRes => {
        // 处理查询结果
        return Promise.resolve(handleLibrary.books(libRes.text))
      })
      .then(books => {
        if (books.length) {
          res.status(200).json({
            statusCode: 200,
            errMsg: '获取成功',
            data: books
          })
        } else {
          res.status(404).json({
            statusCode: 404,
            errMsg: '无结果'
          })
        }
      })
      .catch(err => {
        logger.error('获取借阅信息失败', err)

        res.status(500).json({
          statusCode: 500,
          errMsg: '获取失败'
        })
      })
  } else if (id) {
    // 处理单个图书信息
    request
      .get('http://218.196.244.90:8080/Book.aspx?id=' + id)
      .then(libRes => {
        // 处理查询结果
        return Promise.resolve(handleLibrary.book(libRes.text))
      })
      .then(book => {
        if (book.length) {
          res.status(200).json({
            statusCode: 200,
            errMsg: '获取成功',
            data: book
          })
        } else {
          res.status(404).json({
            statusCode: 404,
            errMsg: '无结果'
          })
        }
      })
      .catch(err => {
        logger.error('获取借阅信息失败', err)

        res.status(500).json({
          statusCode: 500,
          errMsg: '获取失败'
        })
      })
  } else {
    res.status(400).json({
      statusCode: 400,
      errMsg: '参数错误'
    })
  }
}
