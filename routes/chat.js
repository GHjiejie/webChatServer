const express = require("express");
const router = express.Router();
const multer = require("multer");
const chatServices = require("../services/chatServices.js");

// 设置文件存储方式，存储在内存中，不写入磁盘
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 创建私聊房间
router.post("/createPrivateRoom", chatServices.createPrivateRoom);

// 验证私聊房间是否存在
router.post("/verifyPrivateRoom", chatServices.verifyPrivateRoom);

//获取与当前用户有关的所有的会话列表
router.get("/getConversationList/:userId", chatServices.getConversationList);

// 获取选定的会话列表
router.get(
  "/getSelectedConversation/:conversationId",
  chatServices.getSelectedConversation
);

// 根据conversationId获取消息列表
router.get("/getMessages/:conversationId", chatServices.getMessages);

// 发送消息
router.post("/sendMessage", chatServices.sendMessage);

// 处理聊天过程中发送的文件
router.post("/sendFile", upload.single("file"), chatServices.sendFile);

module.exports = router;
