var logger = require('../common/logger');

var News = require('../models/news');
var Logistics = require('../models/logistics');
var Lecture = require('../models/lecture');
var Notice = require('../models/notice');

/**
 * 新闻聚合
 * @param {String} classify 分类
 * @param {String} start query 起始项
 * @param {String} count query 条目数
 */
exports.news = function (req, res, next) {
  var classify = req.params.classify;
  var query = req.query;

  if (!classify) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    });
  }

  /**
   * 查询数据库获取新闻
   * @param {String} classify 分类
   */
  function getNews(classify) {
    classify
      .find({})
      .skip(parseInt(query.start))
      .limit(parseInt(query.count))
      .then(doc => {
        if (doc && doc.length) {
          res.status(200).json({
            statusCode: 200,
            errMsg: '获取新闻成功',
            data: doc
          });
        } else {
          res.status(404).json({
            statusCode: 404,
            errMsg: '获取新闻失败'
          });
        }
      })
      .catch(err => {
        logger.error('获取新闻失败', err);

        res.status(500).json({
          statusCode: 500,
          errMsg: '内部错误'
        });
      });
  }

  switch (classify) {
    case 'news':
      getNews(News);
      break;
    case 'logistics':
      getNews(Logistics);
      break;
    case 'lecture':
      getNews(Lecture);
      break;
    case 'notice':
      getNews(Notice);
      break;
    default:
      res.status(404).json({
        statusCode: 404,
        errMsg: '未找到'
      });
  }
}