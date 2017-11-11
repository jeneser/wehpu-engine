var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 上次匹配进度Flag
var schedulerSchema = new Schema({
  id: String,
  // 新闻网
  flag: String
})

var Scheduler = mongoose.model('Scheduler', schedulerSchema)

module.exports = Scheduler
