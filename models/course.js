var mongoose = require('mongoose')
var Schema = mongoose.Schema

var courseSchema = new Schema({
  openId: String,
  courses: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Course = mongoose.model('Course', courseSchema)

module.exports = Course
