var mongoose = require('mongoose')
var Schema = mongoose.Schema

var lectureSchema = new Schema({
  // 标题
  title: String,
  // 主讲人
  speaker: String,
  // 内容
  content: String,
  // 位置
  place: String,
  // 时间
  time: {
    type: String,
    default: Date.now()
  }
})

var Lecture = mongoose.model('Lecture', lectureSchema)

module.exports = Lecture
