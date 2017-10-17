var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');
var utils = require('../middlewares/utils');

var classroomController = require('../controllers/classroom');
var courseController = require('../controllers/course');
var scoreController = require('../controllers/score');

/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/courses', auth.ensureAuthorized, courseController.course);

/**
 * 查询成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/scores', scoreController.score);

/**
 * 查询空教室
 * @method POST
 * @param {String} [openId] 包含在token中的openId
 */
router.post('/classrooms', auth.ensureAuthorized, utils.requiredCalendar, classroomController.classroom);

module.exports = router;