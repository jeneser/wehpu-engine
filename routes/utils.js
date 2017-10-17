var express = require('express');
var router = express.Router();
var requiredCalendar = require('../middlewares/calendar');

var utilController = require('../controllers/util');

/**
 * 校历
 * @method get
 */
router.get('/calendar', requiredCalendar.calendar, utilController.calendar);

module.exports = router;