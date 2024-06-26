const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");

// 用户注册
router.post("/register", userServices.register);

// 用户登录
router.post("/login", (req, res) => {
  res.json({
    code: 200,
    message: "登录成功",
  });
});

module.exports = router;
