/**
 * 模拟登录河南理工大学教务处URP系统
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/hpufe/fsociety-hpu
 * 
 * rsa-node
 * RSA加密算法库，用于加密VPN密码
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/jeneser/rsa-node
 * 
 * ocr
 * Tesseract自动识别教务处URP系统验证码
 * MIT Copyright (c) 2017 Jeneser
 * Source: https://github.com/jeneser/rsa-node
 */

var path = require('path');
var fs = require('fs');
var gm = require('gm');
var RsaNode = require('rsa-node');
var tesseract = require('node-tesseract');
var request = require('superagent');
require('superagent-charset')(request);

// 配置
var config = {
  // RSA加密参数
  KEY:
    'D41F1B452440585C5D1F853C7CBCB2908CFF324B43A42D7D77D2BB28BD64E2D098079B477D23990E935386FF73CCF865E0D84CE64793306C4083EADECFE36BCC89873EC2BA37D6CA943CB03BA5B4369EE7E31C3539DEA67FF8BF4A5CEE64EB3FD0639E78044B12C7B1D07E86EB7BCF033F78947E0ADE5653B9A88B33AFEB53BD',
  EXP: 65537,

  // OCR参数
  ocr: {
    config: {
      // 临时验证码存放路径，默认输出到当前路径
      dist: path.join(__dirname),
      suffix: '.jpeg',
      // 调整对比度
      contrast: -100,
      // 调整大小
      resize: {
        w: 240,
        h: 80
      }
    },
    options: {
      // 使用已被训练的hpu语言
      l: 'hpu',
      psm: 7,
      binary: 'tesseract'
    }
  },

  // VPN参数
  vpnLoginUrl:
    'https://vpn.hpu.edu.cn/por/login_psw.csp?sfrnd=2346912324982305&encrypt=1',
  vpnLoginHeader: {
    Host: 'vpn.hpu.edu.cn',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
    Referer:
      'https://vpn.hpu.edu.cn/por/login_psw.csp?rnd=0.4288785251262913#http%3A%2F%2Fvpn.hpu.edu.cn%2F',
    Cookie:
      'language=en_US; TWFID=1683ff4c80034a2e; collection=%7Bauto_login_count%3A0%7D; VpnLine=http%3A%2F%2Fvpn.hpu.edu.cn%2F; g_LoginPage=login_psw; VisitTimes=0; haveLogin=0'
  },

  // 教务处URP系统参数
  // urpIndex: 'https://vpn.hpu.edu.cn/web/1/http/0/218.196.240.97/',
  urpLoginUrl:
    'https://vpn.hpu.edu.cn/web/1/http/1/218.196.240.97/loginAction.do',
  urpVerCode:
    'https://vpn.hpu.edu.cn/web/0/http/1/218.196.240.97/validateCodeAction.do?random=0.5239535101287284',
  urpLoginHeader: {
    Host: 'vpn.hpu.edu.cn',
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Referer: 'https://vpn.hpu.edu.cn/web/1/http/0/218.196.240.97/',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
  }
};

/**
 * 自动识别URP系统验证码
 * 递归识别，确保返回正确数据
 * TODO: 训练更多数据以提高识别率
 * @param {*} verCode 原始验证码图片
 * @return {Promise} Promise()
 */
function ocr(verCode, fileName) {
  var verCodePath = path.join(
    config.ocr.config.dist,
    fileName + config.ocr.config.suffix
  );

  // 创建写流
  var verCodeWriteStream = fs.createWriteStream(verCodePath);

  return new Promise((resolve, reject) => {
    // 处理图片
    gm(verCode)
      // 减少图像中的斑点
      .despeckle()
      // 调整对比度
      .contrast(config.ocr.config.contrast)
      // 调整大小
      .resize(config.ocr.config.resize.w, config.ocr.config.resize.h)
      // 写入磁盘
      .stream()
      .pipe(verCodeWriteStream);

    // 写入完成
    verCodeWriteStream.on('close', () => {
      if (fs.existsSync(verCodePath)) {
        // Tesseract-ocr识别验证码
        tesseract.process(verCodePath, config.ocr.options, (err, data) => {
          if (err) {
            reject('识别验证码出错');
          } else {
            var ver = new RegExp('^[a-zA-Z0-9]{4}$');
            if (ver.test(data.trim())) {
              // 删除临时文件
              if (fs.existsSync(verCodePath)) {
                fs.unlink(verCodePath);
              }
              // 返回结果
              resolve(data.trim());
            } else {
              // 递归，再次识别
              ocr(verCode, fileName);
            }
          }
        });
      } else {
        // 递归，再次识别
        ocr(verCode, fileName);
      }
    });

    // 监听写入错误
    verCodeWriteStream.on('error', () => {
      reject('无法写入磁盘');
    });
  });
}

/**
 * 模拟登录
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
 * @param {String} url 要访问的教务资源
 */
exports.login = function(studentId, vpnPassWord, jwcPassWord, url) {
  // 禁用https
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  // 保存Cookie
  var agent = request.agent();

  // 初始化RSA加密算法
  var rsa = new RsaNode(config.KEY, config.EXP);

  if (studentId && vpnPassWord && jwcPassWord) {
    return (
      // 登录VPN
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
        .catch(() => {
          console.error('登陆VPN出错');
        })
        // 识别URP验证码
        .then(() => {
          return agent.get(config.urpVerCode);
        })
        .then(verCodeData => {
          return ocr(verCodeData.body, studentId).catch(() => {
            console.error('验证码识别出错');
          });
        })
        // 登录URP
        .then(verCodeIdentified => {
          return agent
            .post(config.urpLoginUrl)
            .set(config.urpLoginHeader)
            .type('form')
            .send({
              zjh1: '',
              tips: '',
              lx: '',
              evalue: '',
              eflag: '',
              fs: '',
              dzslh: ''
            })
            .send({
              zjh: studentId,
              mm: jwcPassWord,
              v_yzm: verCodeIdentified
            })
            .redirects();
        })
        .catch(() => {
          console.error('登陆URP出错');
        })
        // 登录成功,访问教务资源
        .then(() => {
          return agent.get(url).charset('gbk');
        })
    );
  } else {
    return new Promise((resolve, reject) => {
      reject('参数错误');
    });
  }
};
