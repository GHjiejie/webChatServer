const userController = require("../controller/userController");
const JWT = require("../utils/JWT");
const userServices = {
  // 用户注册
  register: async (req, res) => {
    try {
      const hasUser = await userController.verify(req.body.username);
      if (!hasUser) {
        const result = await userController.register(req);
        if (result) {
          res.json({
            code: 200,
            message: "注册成功",
          });
        }
      } else {
        res.json({
          code: 409,
          message: "用户已存在",
        });
      }
    } catch (error) {
      res.json({
        code: 500,
        message: "注册失败",
      });
    }
  },
  // 用户登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await userController.login(req, res);
      console.log("输出登录结果", result);
      if (result) {
        const token = JWT.generateToken(
          {
            username: username,
            password: password,
          },
          process.env.JWT_SECRET
        );

        res.header("Authorization", token);

        res.json({
          code: 200,
          message: "登录成功",
          data: result,
        });
      } else {
        res.json({
          code: 401,
          message: "用户名或密码错误",
        });
      }
    } catch (error) {
      res.json({
        code: 500,
        message: "登录失败",
      });
    }
  },
  // 根据用户的ID获取用户消息
  info: async (req, res) => {
    // console.log("req", req.params);
    const { userId } = req.params;
    const result = await userController.info(userId);
    if (result) {
      res.json({
        code: 200,
        message: "获取用户信息成功",
        data: result,
      });
    } else {
      res.json({
        code: 500,
        message: "获取用户信息失败",
      });
    }
  },
  // 搜索用户
  searchFriend: async (req, res) => {
    const { keywords } = req.params;
    // 目前先支持根据用户名搜索好友
    const result = await userController.searchFriend(keywords);
    console.log("输出搜索结果", result);
    if (result) {
      res.json({
        code: 200,
        message: "搜索成功",
        data: result,
      });
    } else {
      res.json({
        code: 500,
        message: "搜索失败",
      });
    }
  },
  // 添加好友至好友申请列表
  friendRequest: async (req, res) => {
    const { fromUserId, toUserId } = req.body;
    const result = await userController.friendRequest(fromUserId, toUserId);
    if (result) {
      res.json({
        code: 200,
        message: "好友申请成功",
      });
    } else {
      res.json({
        code: 500,
        message: "好友申请失败",
      });
    }
  },
  // 同意好友申请
  acceptFriendRequest: async (req, res) => {
    const { userId, fromUserId } = req.body;
    const result = await userController.acceptFriendRequest(userId, fromUserId);
    if (result) {
      res.json({
        code: 200,
        message: "同意好友申请成功",
      });
    } else {
      res.json({
        code: 500,
        message: "同意好友申请失败",
      });
    }
  },
  // 拒绝好友申请
  rejectFriendRequest: async (req, res) => {
    const { userId, fromUserId } = req.body;
    const result = await userController.rejectFriendRequest(userId, fromUserId);
    if (result) {
      res.json({
        code: 200,
        message: "拒绝好友申请成功",
      });
    } else {
      res.json({
        code: 500,
        message: "拒绝好友申请失败",
      });
    }
  },
};

module.exports = userServices;
