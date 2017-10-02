var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var indexSchema = new Schema({
  title: String,
  time: {type: Date, default: Date.now()}
});

var Index = mongoose.model('Index', indexSchema);

module.exports = Index;
