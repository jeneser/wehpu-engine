var logger = require('../common/logger')

var News = require('../models/news')
var Logistics = require('../models/logistics')
var Lecture = require('../models/lecture')
var Notice = require('../models/notice')

/**
 * 切换分类
 * @param {String} classify 分类标签
 * @param {String} fn 执行操作
 * @param {*} res 响应回掉
 */
function switchClassify (classify, fn, res) {
  switch (classify) {
    case 'news':
      fn(News)
      break
    case 'logistics':
      fn(Logistics)
      break
    case 'lecture':
      fn(Lecture)
      break
    case 'notice':
      fn(Notice)
      break
    default:
      res.status(404).json({
        statusCode: 404,
        errMsg: '未找到'
      })
  }
}

/**
 * 新闻聚合
 */
exports.news = function (req, res, next) {
  var classify = req.params.classify
  var query = req.query

  if (!classify) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  /**
   * 查询数据库获取新闻
   * @param {String} classify 分类
   */
  function getNews (classify) {
    classify
      .find({}, '_id title time tag')
      .skip(parseInt(query.start))
      .limit(parseInt(query.count))
      .then(doc => {
        if (doc && doc.length) {
          return res.status(200).json({
            statusCode: 200,
            errMsg: '获取新闻成功',
            data: doc
          })
        } else {
          return res.status(404).json({
            statusCode: 404,
            errMsg: '获取新闻失败'
          })
        }
      })
      .catch(err => {
        logger.error('获取新闻失败', err)

        return res.status(500).json({
          statusCode: 500,
          errMsg: '内部错误'
        })
      })
  }

  switchClassify(classify, getNews, res)
}

/**
 * 文章详情
 */
exports.newsDetail = function (req, res, next) {
  var classify = req.params.classify
  var id = req.params.id

  if (!classify || !id) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  function getNews (classify) {
    classify
      .findById(id)
      .then(doc => {
        if (doc && doc.title) {
          var data = {
            // 通用字段
            title: doc.title,
            time: doc.time,
            tag: doc.tag,
            content: doc.content,
            // 附加字段
            href: doc.href,
            place: doc.place,
            speaker: doc.speaker,
            timestamp: doc.timestamp
          }

          return res.status(200).json({
            statusCode: 200,
            errMsg: '获取新闻成功',
            data: data
          })
        } else {
          return res.status(404).json({
            statusCode: 404,
            errMsg: '获取新闻失败'
          })
        }
      })
      .catch(err => {
        logger.error('获取新闻失败', err)

        return res.status(500).json({
          statusCode: 500,
          errMsg: '内部错误'
        })
      })
  }

  switchClassify(classify, getNews, res)
}
