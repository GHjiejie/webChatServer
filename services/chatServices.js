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
  //获取所有的会话列表
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
};

module.exports = chatServices;
