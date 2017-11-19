var express = require('express')
var router = express.Router()

var auth = require('../middlewares/auth')

var loginController = require('../controllers/login')
var bindController = require('../controllers/bind')
var userController = require('../controllers/user')

var classroomController = require('../controllers/classroom')
var courseController = require('../controllers/course')
var scoreController = require('../controllers/score')
var physicalController = require('../controllers/physical')
var libraryController = require('../controllers/library')
var rspController = require('../controllers/rsp')

var calendarController = require('../controllers/calendar')

var newsController = require('../controllers/news')

var feedbackController = require('../controllers/feedback')
var donationController = require('../controllers/donation')

var notifyController = require('../controllers/notify')
var uploadController = require('../controllers/upload')

/**
 * 登录&注册
 * @method POST
 * @param {*} code 用户登录凭证
 * @param {*} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @param {*} iv 加密算法的初始向量
 * @return {*} statusCode 200/400/500
 */
router.post('/login', loginController.login)

/**
 * 绑定&重新绑定
 * @method POST
 * @param {Number} studentId 学号/一卡通号
 * @param {String} vpnPassWord vpn密码
 * @param {String} jwcPassWord 教务处密码
 * @param {String} openId 包含在token中的openId
 * @return {*} statusCode 201/400/403
 */
router.post('/bind', auth.ensureAuthorized, bindController.bind)

/**
 * 用户信息
 * @method GET
 * @param {String} openId 包含在token中的openId
 * @return {*} statusCode 200/400/403/404/500
 */
router.get('/user', auth.ensureAuthorized, userController.user)

/**
 * 更新用户信息
 * @method PUT
 * @param {String} [openId] 包含在token中的openId
 * @return {RES} statusCode 201/400/500 更新用户成功/格式错误/失败
 */
router.put('/user', auth.ensureAuthorized, userController.update)

/**
 * 获取课表
 * @method GET
 * @param {String} openId 包含在token中的openId
 * @return {*} statusCode 200/400/403/404/500
 */
router.get('/course', auth.ensureAuthorized, courseController.course)

/**
 * 本学期成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 * @return {*} statusCode 200/403/404
 */
router.get('/score', auth.ensureAuthorized, scoreController.score)

/**
 * 查询空教室
 * @method POST
 * @param {String} openId 包含在token中的openId
 * @param {String} building 教学楼
 * @param {String} weekly 周次
 * @param {String} section 节次
 * @param {String} week 周
 * @return {RES} statusCode 200/403/404/500
 */
router.post('/classroom', auth.ensureAuthorized, classroomController.classroom)

/**
 * 体测成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/physical', auth.ensureAuthorized, physicalController.physical)

/**
 * 校历
 * @method get
 * @return {RES} statusCode 200/404 校历获取成功/失败
 */
router.get('/calendar', calendarController.calendar)

/**
 * 图书借阅
 * @method get
 * @return {RES} statusCode
 */
router.get('/library/borrowing', auth.ensureAuthorized, libraryController.borrowing)

/**
 * 图书检索
 * @method get
 * @return {RES} statusCode
 */
router.get('/library/books', libraryController.books)

/**
 * 图书检索
 * @method get
 * @return {RES} statusCode
 */
router.get('/library/books/:id', libraryController.books)

/**
 * 后勤报修/完善信息
 * @method get
 * @return {RES} statusCode
 */
router.post('/rsp/user', auth.ensureAuthorized, rspController.user)

/**
 * 后勤报修
 * @method get
 * @return {RES} statusCode
 */
router.post('/rsp/repair', auth.ensureAuthorized, rspController.repair)

/**
 * 新闻聚合
 * @method get
 * @param {String} [openId] 包含在token中的openId
 * @param {String} classify param 新闻分类
 * @param {String} start query 起始项
 * @param {String} count query 条目数
 * @return {RES} statusCode 200/400/403/404/500 查询成功/格式错误/无权/无结果/失败
 */
router.get('/rss/:classify', auth.ensureAuthorized, newsController.news)

/**
 * 反馈
 * @method post
 * @param {String} [openId] 包含在token中的openId
 * @param {Json} data 请求数据
 * @return {RES} statusCode 201/400/500 反馈成功/格式错误/失败
 */
router.post('/feedback', auth.ensureAuthorized, feedbackController.feedback)

/**
 * 捐赠致谢
 * @method get
 * @return {RES} statusCode 200/500 捐赠列表获取成功/失败
 */
router.get('/donation', donationController.donation)

/**
 * 发送模板消息
 * @param {String} [openId] 包含在token中的openId
 * @param {Json} params 请求数据
 * @return {RES} statusCode 200/400/500 发送消息成功/格式错误/失败
 */
router.post('/notify', auth.ensureAuthorized, notifyController.notify)

/**
 * 文件上传
 * @method post
 * @param {String} folder 目标文件夹
 * @param {*} file 目标文件字段
 * @param {String} prefix 文件前缀
 * @return {RES} statusCode 201/400/500 上传成功/失败
 */
router.post('/upload', auth.ensureAuthorized, uploadController.upload)

module.exports = router
