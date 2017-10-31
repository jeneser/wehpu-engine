var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');

var loginController = require('../controllers/login');
var bindController = require('../controllers/bind');
var userController = require('../controllers/user');

var classroomController = require('../controllers/classroom');
var courseController = require('../controllers/course');
var scoreController = require('../controllers/score');

var calendarController = require('../controllers/calendar');

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
 * @return {RES} statusCode 201/400/403/404
 */
router.get('/course', auth.ensureAuthorized, courseController.course);

/**
 * 本学期成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 * @return {RES} statusCode 200/403/404
 */
router.get('/score', auth.ensureAuthorized, scoreController.score);

/**
 * 查询空教室
 * @method POST
 * @param {String} [openId] 包含在token中的openId
 */
router.post('/classroom', auth.ensureAuthorized, classroomController.classroom);


/**
 * 校历
 * @method get
 * @return {RES} statusCode 200/404 校历获取成功/失败
 */
router.get('/calendar', calendarController.calendar);


/**
 * 反馈
 * @method post
 * @param {String} [openId] 包含在token中的openId
 * @param {Json} data 请求数据
 * @return {RES} statusCode 201/400/500 反馈成功/格式错误/失败
 */
router.post('/feedback', auth.ensureAuthorized, feedbackController.feedback);

/**
 * 捐赠致谢
 * @method get
 * @return {RES} statusCode 200/500 捐赠列表获取成功/失败
 */
router.get('/donation', donationController.donation);

module.exports = router;