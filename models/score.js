var mongoose = require('mongoose')
var Schema = mongoose.Schema

var scoreSchema = new Schema({
  // id
  id: String,
  // 空闲教室数据
  scores: Array,
  // 学期
  term: String,
  // 创建日期
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Score = mongoose.model('Score', scoreSchema)

module.exports = Score
