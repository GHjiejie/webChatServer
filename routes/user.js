const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");

// 用户注册
router.post("/register", userServices.register);

// 用户登录
router.post("/login", userServices.login);

// 获取用户的信息

module.exports = router;
