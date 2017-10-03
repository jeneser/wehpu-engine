var User = require('../models/user');

/**
 * 用户查询，返回单个用户信息
 * openid: 用户openid
 */
exports.user = function (req, res, next) {
  var openid = req.params.openid;

  if (!openid) {
    res.status(400).json({
      code: 400,
      msg: '请求格式错误！'
    })
  }

  User.findOne({
    openid: openid
  })
    .then(person => {
      res.status(200).json({
        code: 200,
        msg: '查询成功',
        data: person
      });
    })
    .catch(err => {
      res.status(404).json({
        code: 404,
        msg: '用户不存在',
        data: person
      });
    })
}