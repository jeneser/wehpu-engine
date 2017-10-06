/**
 * 模拟登录河南理工大学外网访问VPN服务
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/hpufe/fsociety-hpu
 * 
 * rsa-node
 * RSA加密算法库，用于加密VPN密码
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/jeneser/rsa-node
 */

var RsaNode = require('rsa-node');
var request = require('superagent');
require('superagent-charset')(request);

// 配置
var config = {
  // RSA加密参数
  KEY: 'D41F1B452440585C5D1F853C7CBCB2908CFF324B43A42D7D77D2BB28BD64E2D098079B477D23990E935386FF73CCF865E0D84CE64793306C4083EADECFE36BCC89873EC2BA37D6CA943CB03BA5B4369EE7E31C3539DEA67FF8BF4A5CEE64EB3FD0639E78044B12C7B1D07E86EB7BCF033F78947E0ADE5653B9A88B33AFEB53BD',
  EXP: 65537,

  // VPN参数
  vpnLoginUrl: 'https://vpn.hpu.edu.cn/por/login_psw.csp?sfrnd=2346912324982305&encrypt=1',
  vpnLoginHeader: {
    Host: 'vpn.hpu.edu.cn',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
    Referer: 'https://vpn.hpu.edu.cn/por/login_psw.csp?rnd=0.4288785251262913#http%3A%2F%2Fvpn.hpu.edu.cn%2F',
    Cookie: 'language=en_US; TWFID=1683ff4c80034a2e; collection=%7Bauto_login_count%3A0%7D; VpnLine=http%3A%2F%2Fvpn.hpu.edu.cn%2F; g_LoginPage=login_psw; VisitTimes=0; haveLogin=0'
  }
};

/**
 * 模拟登录
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {String} url 要访问的内网资源
 */
exports.login = function (studentId, vpnPassWord, url) {
  // 禁用https
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  // 保存Cookie
  var agent = request.agent();

  // 初始化RSA加密算法
  var rsa = new RsaNode(config.KEY, config.EXP);

  if (studentId && vpnPassWord) {
    // 登录VPN
    return (
      agent
      .post(config.vpnLoginUrl)
      .set(config.vpnLoginHeader)
      .type('form')
      .send({
        svpn_name: studentId
      })
      .send({
        svpn_password: rsa.encrypt(vpnPassWord)
      })
      .redirects()
      .then(() => {
        return agent.get(url);
      })
      .catch(err => {
        res.status(500).json({
          statusCode: 500,
          errMsg: 'VPN系统繁忙，请稍后重试'
        });
      })
    )
  } else {
    res.status(400).json({
      statusCode: 400,
      errMsg: '参数错误'
    });
  }
}