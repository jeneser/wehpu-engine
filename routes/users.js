var express = require('express');
var router = express.Router();

var loginController = require('../controllers/login');

// 登录
router.post('/login', loginController.login);

module.exports = router;
