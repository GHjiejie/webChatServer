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

    // 消息内容
    content: {
      type: new Schema(
        {
          // 发送者 ID
          senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          // 消息文本内容
          text: {
            type: String,
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
          // 文件类型 (可选, 仅当 type 为 'file' 时需要)
          fileType: {
            type: String,
          },

          // 文件名 (可选, 仅当 type 为 'file' 时需要)
          fileName: {
            type: String,
          },

          // 发送时间
          sentAt: {
            type: Date,
            default: Date.now,
            required: true,
          },
        },
        { _id: false } // 禁用嵌套文档的 _id
      ),
      required: true,
    },
  },
  { timestamps: true }
);

// 创建索引
messageSchema.index(
  { conversationId: 1, "content.sentAt": 1 },
  { background: true }
); // 优化历史消息查询

module.exports = mongoose.model("Message", messageSchema);
