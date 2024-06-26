const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    // 所属会话 ID
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // 发送者 ID
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 消息内容
    content: {
      type: String,
      required: true,
    },

    // 消息类型
    type: {
      type: String,
      enum: ["text", "image", "file"], // 可以根据需要添加更多类型
      required: true,
    },

    // 文件或图片链接 (可选, 仅当 type 为 'image' 或 'file' 时需要)
    mediaUrl: {
      type: String,
    },

    // 文件名 (可选, 仅当 type 为 'file' 时需要)
    fileName: {
      type: String,
    },

    // 消息状态 (可选)
    status: {
      type: String,
      enum: ["sent", "delivered", "read"], // 可以根据需要添加更多状态
      default: "sent",
    },
  },
  { timestamps: true }
);

// 创建索引
messageSchema.index({ conversationId: 1, createdAt: 1 }, { background: true }); // 优化历史消息查询

module.exports = mongoose.model("Message", messageSchema);
