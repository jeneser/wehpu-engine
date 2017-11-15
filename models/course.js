var mongoose = require('mongoose')
var Schema = mongoose.Schema

var courseSchema = new Schema({
  // openId
  openId: String,
  // 课程数据
  courses: Object,
  // 学期
  term: String,
  // 创建日期
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Course = mongoose.model('Course', courseSchema)

module.exports = Course
