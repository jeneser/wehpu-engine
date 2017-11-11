var fs = require('fs')
var crypto = require('crypto')
var config = require('../config')
var mimeWhiteList = require('./whiteList')

/**
 * AES加密
 * @param {String} data 加密数据
 */
exports.aesEncrypt = function (data) {
  const cipher = crypto.createCipher(config.commonAlgorithm, config.commonSecret)
  var crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * AES解密
 * @param {String} encrypted 解密数据
 */
exports.aesDecrypt = function (encrypted) {
  const decipher = crypto.createDecipher(config.commonAlgorithm, config.commonSecret)
  var decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

/**
 * MIME类型转扩展名
 * @param {String} type mime类型
 * @return {String} ext 对应的扩展名
 */
exports.mimeToExt = function (type) {
  var mime = mimeWhiteList.find(elem => {
    return elem.mime.toLowerCase() === type.toLowerCase()
  })

  return mime ? mime.ext : ''
}

/**
 * 过滤非白名单mime类型
 * @param {String} type mime类型
 * @return {Boolean} 合法文件类型
 */
exports.filterMime = function (mime) {
  var _mime = mimeWhiteList.find(elem => {
    return elem.mime.toLowerCase() === mime.toLowerCase()
  })

  return !!_mime
}

/**
 * 删除磁盘文件
 * @param {String} path 文件路径
 */
exports.unlink = function (path) {
  if (fs.existsSync(path)) {
    fs.unlink(path)
  }
}

/**
 * 处理校历信息
 * @return {Promise} 处理结果
 */
exports.getCalendar = function () {
  return new Promise((resolve, reject) => {
    var calendar = {}

    // 当前学期
    calendar.currentTerm = config.calendar.currentTerm
    // 开学日期
    calendar.termStart = config.calendar.termStart
    // 总周数
    calendar.totalWeekly = config.calendar.totalWeekly

    // 计算当前周次 1: 第一周
    calendar.currentWeekly = (Date.now() > Date.parse(calendar.termStart)) ? calendar.totalWeekly : Math.ceil((Date.now() - Date.parse(calendar.termStart)) / 604800000)

    resolve(calendar)
  })
}
