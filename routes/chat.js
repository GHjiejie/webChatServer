const express = require("express");
const router = express.Router();
const chatServices = require("../services/chatServices.js");

// 创建私聊房间
router.post("/createPrivateRoom", chatServices.createPrivateRoom);

// 验证私聊房间是否存在
router.post("/verifyPrivateRoom", chatServices.verifyPrivateRoom);

//获取所有的会话列表
router.get("/getConversationList/:userId", chatServices.getConversationList);

module.exports = router;
