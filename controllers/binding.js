var HPUVpnLogin = require('../vendor/HPUVpnLogin')

/**
 * 帐号绑定
 * studentId: 学号/一卡通号
 * vpnPassWord: vpn密码
 * jwcPassWord: 教务处密码
 */
exports.binding = function (req, res, next) {
  // var studentId = req.body.studentId;
  // var vpnPassWord = req.body.vpnPassWord;
  // var jwcPassWord = req.body.jwcPassWord;

  // if(!studentId && !vpnPassWord && !jwcPassWord) {
  //   res.status(400).json({
  //     code: 400,
  //     errMsg: '请求格式错误！'
  //   });
  // }

  HPUVpnLogin.login('311509040120', '211219');
  
}