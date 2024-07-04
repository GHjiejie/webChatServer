const userSchema = require("../models/user.model");

const userController = {
  // 用户注册
  register: async (req) => {
    try {
      const { username, password } = req.body;
      const result = await userSchema.create({ username, password });
      return result;
    } catch (error) {}
  },

  // 用户登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await userSchema.findOne({ username, password });
      return result;
    } catch (error) {}
  },

  // 根据用户的ID获取用户消息
  info: async (userId) => {
    try {
      const user = await userSchema.findById(userId);
      return user;
    } catch (error) {}
  },

  // 搜索好友
  searchFriend: async (keywords) => {
    try {
      const result = await userSchema.find({ username: { $regex: keywords } });
      return result;
    } catch (error) {}
  },

  // 更新用户信息
  updateUserInfo: async (userId, username, avatar, phone) => {
    try {
      const result = await userSchema.findByIdAndUpdate(userId, {
        username,
        avatar,
        phone,
      });
      return result;
    } catch (error) {}
  },

  // 添加好友至好友列表（还未同意）
  friendRequest: async (fromUserId, toUserId) => {
    // 更新申请者的好友发送列表
    const result = await userSchema.findByIdAndUpdate(fromUserId, {
      $push: { sentFriendRequests: { userId: toUserId } },
    });
    // 更新接收者的好友申请列表
    const result2 = await userSchema.findByIdAndUpdate(toUserId, {
      $push: { friendRequests: { userId: fromUserId } },
    });
    // 等待所有的promise执行完毕
    const finalResults = Promise.all([result, result2]);
    return finalResults;
  },

  // 同意好友申请
  acceptFriendRequest: async (userId, fromUserId) => {
    const result1 = await userSchema.findOneAndUpdate(
      { _id: userId, "friendRequests.userId": fromUserId },
      {
        $set: { "friendRequests.$.status": "accepted" },
        $push: { friends: fromUserId },
      }
    );

    // 更新发送方的请求状态
    const result2 = await userSchema.findOneAndUpdate(
      { _id: fromUserId, "sentFriendRequests.userId": userId },
      { $set: { "sentFriendRequests.$.status": "accepted" } }
    );
    // // 反向添加好友(将好友添加到我的好友列表)
    await userSchema.findByIdAndUpdate(fromUserId, {
      $push: { friends: userId },
    });

    const finalResults = Promise.all([result1, result2]);
    return finalResults;
  },

  // 拒绝好友申请
  rejectFriendRequest: async (userId, fromUserId) => {
    const result1 = await userSchema.findOneAndUpdate(
      { _id: userId, "friendRequests.userId": fromUserId },
      { $set: { "friendRequests.$.status": "rejected" } }
    );
    const result2 = await userSchema.findOneAndUpdate(
      { _id: fromUserId, "sentFriendRequests.userId": userId },
      { $set: { "sentFriendRequests.$.status": "rejected" } }
    );
    const finalResults = Promise.all([result1, result2]);
    return finalResults;
  },

  // 判断用户是否为好友
  isFriend: async (userId, friendId) => {
    const user = await userSchema.findById(userId);
    const isFriend = user.friends.includes(friendId);
    return isFriend;
  },

  // 判断是否发送过好友申请
  isSentFriendRequest: async (userId, friendId) => {
    const user = await userSchema.findById(userId);
    // 问题出在比较 ObjectId 的方式上。你不能直接使用 === 来比较两个 ObjectId，即使它们看起来相同。
    const isSent = user.sentFriendRequests.some((item) =>
      item.userId.equals(friendId)
    );

    return isSent;
  },

  // 验证用户是否存在
  verify: async (username) => {
    return await userSchema.findOne({ username });
  },
};

module.exports = userController;
