var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  studentId: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  idNumber: {
    type: String,
    default: ''
  },
  vpnPassWord: {
    type: String,
    default: ''
  },
  jwcPassWord: {
    type: String,
    default: ''
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
