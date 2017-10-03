var express = require('express');
var router = express.Router();

var loginController = require('../controllers/login');
var bindingController = require('../controllers/binding');
var userController = require('../controllers/user');

// 登录&注册 [POST]
router.post('/login', loginController.login);

// 绑定&解绑 [POST]
router.post('/binding', bindingController.binding);

// 用户查询 [GET]
// router.get('/:openid', userController.user);

module.exports = router;
