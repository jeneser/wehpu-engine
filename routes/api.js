var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');
var utils = require('../middlewares/utils');

var loginController = require('../controllers/login');
var bindController = require('../controllers/bind');
var userController = require('../controllers/user');

var classroomController = require('../controllers/classroom');
var courseController = require('../controllers/course');
var scoreController = require('../controllers/score');

var utilController = require('../controllers/util');

var feedbackController = require('../controllers/feedback');
var donationController = require('../controllers/donation');

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


/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/course', auth.ensureAuthorized, courseController.course);

/**
 * 查询成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/score', scoreController.score);

/**
 * 查询空教室
 * @method POST
 * @param {String} [openId] 包含在token中的openId
 */
router.post(
  '/classroom',
  auth.ensureAuthorized,
  utils.requiredCalendar,
  classroomController.classroom
);


/**
 * 校历
 * @method get
 */
router.get('/calendar', utils.requiredCalendar, utilController.calendar);


/**
 * 反馈
 * @method post
 */
router.post('/feedback', feedbackController.feedback);

/**
 * 捐赠致谢
 * @method get
 */
router.get('/donation', donationController.donation);

module.exports = router;
