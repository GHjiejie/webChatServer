const chatController = require("../controller/chatController.js");
const chatServices = {
  // 创建私聊房间
  createPrivateRoom: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const result = await chatController.createPrivateRoom(userId, friendId);
      console.log("result", result);
      if (result) {
        res.json({
          code: 200,
          message: "创建私聊房间成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "创建私聊房间失败",
        });
      }
    } catch (error) {}
  },
  // 验证私聊房间是否存在
  verifyPrivateRoom: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const result = await chatController.verifyPrivateRoom(userId, friendId);
      if (result) {
        res.json({
          code: 200,
          message: "私聊房间存在",
          data: result,
        });
      } else {
        res.json({
          code: 404,
          message: "私聊房间不存在",
        });
      }
    } catch (error) {}
  },
  //获取与当前用户有关的所有的会话列表
  getConversationList: async (req, res) => {
    // const { userId } = req.query;
    const { userId } = req.params;
    try {
      const result = await chatController.getConversationList(userId);
      if (result) {
        res.json({
          code: 200,
          message: "获取会话列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取会话列表失败",
        });
      }
    } catch (error) {}
  },
  // 获取选定的会话列表
  getSelectedConversation: async (req, res) => {
    const { conversationId } = req.params;
    try {
      const result = await chatController.getSelectedConversation(
        conversationId
      );
      if (result) {
        res.json({
          code: 200,
          message: "获取选定的会话列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取选定的会话列表失败",
        });
      }
    } catch (error) {}
  },
  // 根据conversationId获取消息列表
  getMessages: async (req, res) => {
    const { conversationId } = req.params;
    console.log("conversationId", conversationId);
    try {
      const result = await chatController.getMessages(conversationId);
      if (result) {
        res.json({
          code: 200,
          message: "获取消息列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取消息列表失败",
        });
      }
    } catch (error) {}
  },
  // 发送消息
  sendMessage: async (req, res) => {
    const { conversationId, content } = req.body;
    // console.log("conversationId", conversationId);
    // console.log("content", content);
    try {
      const result = await chatController.sendMessage(conversationId, content);
      if (result) {
        res.json({
          code: 200,
          message: "发送消息成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "发送消息失败",
        });
      }
    } catch (error) {}
  },
};

module.exports = chatServices;
