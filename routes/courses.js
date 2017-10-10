var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var courseController = require('../controllers/course');

/**
 * 获取课表
 * @method GET
 * @param {String} [openId] 包含在token中的openId
 */
router.get('/course', auth.ensureAuthorized, courseController.course);

module.exports = router;
