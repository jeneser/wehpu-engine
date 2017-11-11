var util = require('./util')

var User = require('../models/user')

/**
 * 获取用户基本密码信息
 * @return {Promise} 通用密码
 */
exports.getUserInfo = function (openId) {
  // 查询用户
  return new Promise((resolve, reject) => {
    Promise.resolve(
        User.findOne({
          openId: openId
        })
      )
      .then(person => {
        if (person) {
          // 解密用户信息
          var userInfo = {
            studentId: person.studentId,
            vpnPassWord: util.aesDecrypt(person.vpnPassWord),
            jwcPassWord: util.aesDecrypt(person.jwcPassWord),
            idNumber: util.aesDecrypt(person.idNumber)
          }

          resolve(userInfo)
        } else {
          reject(new Error('获取用户信息失败'))
        }
      })
  })
}
