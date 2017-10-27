var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var loginController = require('../controllers/login');
var bindController = require('../controllers/bind');
var userController = require('../controllers/user');

/**
 * 登录&注册
 * @method POST
 * @param {*} code 用户登录凭证
 * @param {*} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @param {*} iv 加密算法的初始向量
 * @return {RES} statusCode 200/201/400/500 返回/创建新用户成功/格式错误/登录出错
 */
router.post('/login', loginController.login);

/**
 * 绑定&重新绑定
 * @method POST
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
 * @param {String} [openId] 包含在token中的openId
 * @return {RES} statusCode 201/400/403 绑定成功/失败/无权访问
 */
router.post('/bind', auth.ensureAuthorized, bindController.bind);

/**
 * 用户信息
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 * @return {RES} statusCode 200/400/403/500 查询用户成功/格式错误/无权访问/失败
 */
router.get('/user', auth.ensureAuthorized, userController.user);

module.exports = router;
