const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    // 会话类型
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,   
    },

    // 会话成员       
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // 会话名称 (可选, 仅群聊需要)
    chatName: {
      type: String,
      trim: true,
    },

    // 最后一条消息 (可选, 用于优化会话列表展示)
    lastMessage: {
      _id: false, // 嵌套文档不需要 _id
      content: String,
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    },
  },
  { timestamps: true }
);

// 创建索引
conversationSchema.index({ members: 1 }, { background: true }); // 优化用户会话查询

module.exports = mongoose.model("Conversation", conversationSchema);
