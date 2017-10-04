var HPUVpnLogin = require('../vendor/HPUVpnLogin')
var HPUUrpLogin = require('../vendor/HPUUrpLogin')

/**
 * 帐号绑定
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
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

  // HPUVpnLogin.login(studentId, vpnPassWord, 'https://vpn.hpu.edu.cn/por/service.csp')
  //   // 测试是否访问成功
  //   .then(serviceContent => {
  //     if (/欢迎您/.test(serviceContent.text)) {
  //       return Promise.resolve('访问成功！');
  //     } else {
  //       return Promise.reject('访问失败！');
  //     }
  //   })
  //   // 访问下一个资源
  //   .then(r => {
  //     console.log(r);
  //   })
  //   .catch(err => console.log(err));

  HPUUrpLogin.login('311509040120', '211219', '311509040120', 'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/xjInfoAction.do?oper=xjxx')
    .then(urpContent => {
      console.log(urpContent);
    })

}