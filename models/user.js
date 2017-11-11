var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  // 微信用户基本信息
  openId: String,
  nickName: String,
  gender: Number,
  city: String,
  avatarUrl: String,
  timestamp: {
    type: Date,
    default: Date.now()
  },

  // 绑定信息
  bind: {
    type: Boolean,
    default: false
  },
  // 学号
  studentId: {
    type: String,
    default: ''
  },
  // 姓名
  name: {
    type: String,
    default: ''
  },
  // 身份证号 加密
  idNumber: {
    type: String,
    default: ''
  },
  // vpn密码 加密
  vpnPassWord: {
    type: String,
    default: ''
  },
  // 教务处密码 加密
  jwcPassWord: {
    type: String,
    default: ''
  }
})

var User = mongoose.model('User', userSchema)

module.exports = User
