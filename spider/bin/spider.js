var bluebird = require('bluebird')
var mongoose = require('mongoose')
var logger = require('../common/logger')
var config = require('../config')
var app = require('../app')

mongoose.Promise = bluebird

// 连接数据库
var connectdb = Promise.resolve(mongoose.connect(config.mongodb, {
  useMongoClient: true,
  connectWithNoPrimary: true
}))

connectdb
  .then(db => {
    app.run()
  })
  .catch(err => {
    logger.error('初始化失败，已取消任务', err)
  })
