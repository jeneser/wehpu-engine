var jwt = require('jsonwebtoken')
var config = require('../config')

/**
 * 验证token
 * @param {*} bearerToken json web token
 */
exports.ensureAuthorized = function (req, res, next) {
  var bearerToken
  var bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    // 提取token
    var bearer = bearerHeader.split(' ')
    bearerToken = bearer[1]

    // 验证token
    jwt.verify(bearerToken, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(403).json({
          statusCode: 403,
          errMsg: '没有访问权限'
        })
      } else {
        req.token = bearerToken
        req.jwtPayload = decoded
        next()
      }
    })
  } else {
    res.status(403).json({
      statusCode: 403,
      errMsg: '没有访问权限'
    })
  }
}
