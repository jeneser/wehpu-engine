var request = require('superagent');
var logger = require('../common/logger');
var HPULibLogin = require('../vendor/HPULibLogin');
var handleLibrary = require('../common/library');

/**
 * 图书借阅信息
 */
exports.borrowing = function (req, res, next) {
  // 登录图书馆获取借阅信息
  Promise
    .resolve(HPULibLogin.login({
      studentId: '',
      passWord: '',
      url: 'http://218.196.244.90:8080/Borrowing.aspx'
    }))
    .then(libRes => {
      // TODO: 检验是否登录成功
      return Promise.resolve(handleLibrary.borrowing(libRes.text));
    })
    .then(books => {
      res.status(200).json({
        statusCode: 200,
        errMsg: '获取成功',
        data: books
      });
    })
    .catch(err => {
      logger.error('获取借阅信息失败', err);

      res.status(500).json({
        statusCode: 500,
        errMsg: '获取失败'
      });
    });
}

/**
 * 图书借阅信息
 */
exports.books = function (req, res, next) {

}