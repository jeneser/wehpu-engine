var mongoose = require('mongoose')
var Schema = mongoose.Schema

var logisticsSchema = new Schema({
  // 标题
  title: String,
  // 内容
  content: String,
  // 标签
  tag: String,
  // 发布时间
  time: {
    type: String,
    default: Date.now()
  },
  // 抓取时间
  create_at: {
    type: Date,
    default: Date.now()
  }
})

var Logistics = mongoose.model('Logistics', logisticsSchema)

module.exports = Logistics
