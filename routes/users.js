var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var loginController = require('../controllers/login');
var bindingController = require('../controllers/binding');
var userController = require('../controllers/user');

/**
 * 登录&注册
 * @method POST
 * @param {*} code 用户登录凭证
 * @param {*} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @param {*} iv 加密算法的初始向量
 */
router.post('/login', loginController.login);

/**
 * 绑定&解绑
 * @method POST
 * @param {Number} studentId 学号/一卡通号
 * @param {Number} vpnPassWord vpn密码
 * @param {Number} jwcPassWord 教务处密码
 * @param {String} [openid] 包含在token中的openid
 */
router.post('/binding', auth.ensureAuthorized, bindingController.binding);

/**
 * 单用户查询
 * @method GET
 * @param {String} [openid] 包含在token中的openid
 */
router.get('/userInfo', auth.ensureAuthorized, userController.user);

module.exports = router;
