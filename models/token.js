var mongoose = require('mongoose')
var Schema = mongoose.Schema

var tokenSchema = new Schema({
  id: String,
  // access_token
  wxAccessToken: String,
  // 凭证有效时间 ms
  expiresIn: Number,
  // 创建日期
  timestamp: {
    type: Date,
    default: Date.now()
  }
})

var Token = mongoose.model('Token', tokenSchema)

module.exports = Token
