var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var classroomController = require('../controllers/classroom');

/**
 * 查询空教室
 * @method POST
 * @param {String} [openId] 包含在token中的openId
 */

// router.post('/classroom', auth.ensureAuthorized, classroomController.classroom);
router.post('/classroom', classroomController.classroom);

module.exports = router;