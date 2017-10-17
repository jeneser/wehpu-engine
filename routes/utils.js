var express = require('express');
var router = express.Router();
var utils = require('../middlewares/utils');

var utilController = require('../controllers/util');

/**
 * 校历
 * @method get
 */
router.get('/calendar', utils.requiredCalendar, utilController.calendar);

module.exports = router;