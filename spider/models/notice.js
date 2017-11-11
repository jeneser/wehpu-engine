var mongoose = require('mongoose')
var Schema = mongoose.Schema

var noticeSchema = new Schema({
  // 标题
  title: String,
  // 内容
  content: {
    type: String,
    default: ''
  },
  // 资源路径
  href: {
    type: String,
    default: ''
  },
  // 抓取时间
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Notice = mongoose.model('Notice', noticeSchema)

module.exports = Notice
