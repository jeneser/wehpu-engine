var mongoose = require('mongoose')
var Schema = mongoose.Schema

var classroomSchema = new Schema({
  // id
  id: String,
  // 空闲教室数据
  rooms: Array,
  // 学期
  term: String,
  // 创建日期
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Classroom = mongoose.model('Classroom', classroomSchema)

module.exports = Classroom
