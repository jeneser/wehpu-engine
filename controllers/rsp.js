var logger = require('../common/logger')
var HPURspLogin = require('../vendor/HPURspLogin')
var handleUser = require('../common/user')

var rspHeader = {
  Host: 'houqin.hpu.edu.cn',
  Connection: 'keep-alive',
  Accept: '*/*',
  Origin: 'http://houqin.hpu.edu.cn',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36',
  DNT: 1,
  Referer: 'http://houqin.hpu.edu.cn/rsp/my/wantrepair',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6'
}

/**
 * 完善用户信息
 * @param {String} nickname 昵称
 * @param {String} mobile 手机号
 * @param {String} address 寝室号
 */
exports.user = function (req, res, next) {
  var openId = req.jwtPayload.openId
  var nickname = req.body.nickname
  var mobile = req.body.mobile
  var address = req.body.address

  if (!nickname || !mobile || !address || nickname.length > 10) {
    res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  // 查询用户，获取登录密码
  Promise
    .resolve(handleUser.getUserInfo(openId))
    .then(userInfo => {
      return Promise
        .resolve(HPURspLogin.login({
          studentId: userInfo.studentId,
          // 身份证后六位
          passWord: userInfo.idNumber.substr(-6)
        }))
    })
    .then(agent => {
      // 更新信息
      return agent
        .post('http://houqin.hpu.edu.cn/rsp/my/info')
        .send({
          Nickname: nickname,
          Mobile: mobile,
          Address: address,
          // 固定值
          MID: '0015F797-E29F-486D-86E1-490E5BC04838'
        })
    })
    .then(() => {
      res.status(201).json({
        statusCode: 201,
        errMsg: '更新成功'
      })
    })
    .catch(err => {
      logger.error(err)

      res.status(500).json({
        statusCode: 500,
        errMsg: '内部错误'
      })
    })
}

/**
 * 报修
 */
exports.repair = function (req, res, next) {
  var openId = req.jwtPayload.openId
  var params = req.body

  if (!params.projectSerial || !params.projectName || !params.mobile || !params.bUserName || !params.bContent || !params.bAddress || !params.areaSerial || !params.areaName) {
    return res.status(400).json({
      statusCode: 400,
      errMsg: '格式错误'
    })
  }

  // 查询用户，获取登录密码
  Promise
    .resolve(handleUser.getUserInfo(openId))
    .then(userInfo => {
      return Promise
        .resolve(HPURspLogin.login({
          studentId: userInfo.studentId,
          // 身份证后六位
          passWord: userInfo.idNumber
        }))
    })
    .then(agent => {
      // 报修表单
      return agent
        .post('http://houqin.hpu.edu.cn/rsp/my/wantrepair')
        .set(rspHeader)
        .set({
          'X-Requested-With': 'XMLHttpRequest'
        })
        .set({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
        .send({
          // 区域序列号
          Area_Serial: params.areaSerial,
          // 校区
          Area_Name: params.areaName,
          // 地址
          Baddress: params.bAddress,
          // 项目名
          Project_Name: params.projectName,
          // 维修项目序列号
          Project_Serial: params.projectSerial,
          // 报修内容
          Bcontent: params.bContent,
          // 手机号
          Mobile: params.mobile,
          // 姓名
          BuserName: params.bUserName,
          // 留空
          InfoID: '',
          pwdstr: 'CD372815CC48AE6F74872BB4E2DD1E85',
          // 图片列表 ,分割
          imglist: params.imgList,
          // 固定值
          Bsource: '1'
        })
        .redirects()
    })
    .then(data => {
      logger.info(data)
      return res.status(201).json({
        statusCode: 201,
        errMsg: '报修成功'
      })
    })
    .catch(err => {
      logger.error(err)

      return res.status(500).json({
        statusCode: 500,
        errMsg: '内部错误'
      })
    })
}
