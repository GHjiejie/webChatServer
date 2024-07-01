const conversationSchema = require("../models/conversation.model.js");
const userSchema = require("../models/user.model.js");
const chatController = {
  // 创建私聊房间
  createPrivateRoom: async (userId, friendId) => {
    try {
      const result = await conversationSchema.create({
        type: "private",
        members: [userId, friendId],
      });
      return result;
    } catch (error) {}
  },
  // 验证私聊房间是否存在
  verifyPrivateRoom: async (userId, friendId) => {
    try {
      const result = await conversationSchema.findOne({
        type: "private",
        members: { $all: [userId, friendId] },
      });
      return result;
    } catch (error) {}
  },
  // 获取所有的会话列表
  getConversationList: async (userId) => {
    try {
      const result = await conversationSchema.find({ members: userId });

      const formattedConversations = await Promise.all(
        result.map(async (conversation) => {
          if (conversation.type === "private") {
            const friendId = conversation.members.find(
              (member) => member.toString() !== userId
            );
            // 使用异步函数获取用户信息
            const friend = await userSchema.findById({ _id: friendId });

            // 创建新的会话对象，并将 friend 数据添加进去
            return {
              ...conversation.toObject(), // 复制 conversation 对象的属性
              friend: friend,
            };
          } else {
            // 处理群聊逻辑，并返回新的会话对象
            return {
              ...conversation.toObject(), // 复制 conversation 对象的属性
              // ...其他群聊相关属性
            };
          }
        })
      );

      return formattedConversations;
    } catch (error) {
      console.error("获取会话列表失败:", error);
      // 错误处理
    }
  },
};
module.exports = chatController;
