const userSchema = require("../models/user.model");
const JWT = require("../utils/JWT");

const userController = {
  // 用户注册
  register: async (req) => {
    try {
      const { username, password } = req.body;
      const user = await userSchema.create({ username, password });
      return {
        code: 200,
        message: "注册成功",
        data: {
          _id: user._id,
          username: user.username,
          //...其他需要返回的用户信息
        },
      };
    } catch (error) {
      console.error("注册失败:", error); // 打印错误信息到控制台，方便排查问题
      return {
        code: 500,
        message: "注册失败",
      };
    }
  },

  // 用户登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userSchema.findOne({ username, password });
      if (user) {
        // 设置token
        const token = JWT.generateToken(
          { username, password },
          process.env.JWT_SECRET
        );
        // 将token放在响应头中返回给前端
        res.authorization = token;
        return {
          code: 200,
          message: "登录成功",
          data: {
            _id: user._id,
            username: user.username,
          },
        };
      } else {
        return {
          code: 401,
          message: "用户名或密码错误",
          data: null,
        };
      }
    } catch (error) {
      console.error("登录失败:", error);
      return {
        code: 500,
        message: "登录失败",
      };
    }
  },
  verify: async (username) => {
    return await userSchema.findOne({ username });
  },
};

module.exports = userController;
