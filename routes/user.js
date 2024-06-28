const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");

// 用户注册
router.post("/register", userServices.register);

// 用户登录
router.post("/login", userServices.login);

// 根据用户的ID获取用户消息
router.get("/info/:userId", userServices.info);

// 搜索好友
router.get("/searchFriend/:keywords", userServices.searchFriend);

// 添加好友至好友申请列表
router.post("/friendRequest", userServices.friendRequest);

// 同意好友申请
router.post("/acceptFriendRequest", userServices.acceptFriendRequest);

// 拒绝好友申请
router.post("/rejectFriendRequest", userServices.rejectFriendRequest);

// router.post("/addFriend", userServices.addFriend);

module.exports = router;
