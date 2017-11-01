var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  // 标题
  title: String,
  // 内容
  content: String,
  // 作者
  author: String,
  // 发布时间
  time: {
    type: String,
    default: Date.now()
  },
  images: Array
});

var News = mongoose.model('News', newsSchema);

module.exports = News;