var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var scoreController = require('../controllers/score');

/**
 * 查询成绩
 * @method get
 * @param {String} [openId] 包含在token中的openId
 * @param {String} [type] 查询类型
 */
router.get('/score', scoreController.score);

module.exports = router;