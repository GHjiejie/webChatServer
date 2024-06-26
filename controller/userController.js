const userSchema = require("../models/user.model");

const userController = {
  // 用户注册
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      const user = await userSchema.create({ username, password });
      res.json({
        code: 200,
        message: "注册成功",
        data: user,
      });
    } catch (error) {
      res.json({
        code: 500,
        message: "注册失败",
      });
    }
  },

  // 用户登录
  // login: async (req, res) => {
  //   try {
  //     const { username, password } = req.body;
  //     const user = await userSchema.findOne({ username, password });
  //     if (user) {
  //       res.json({
  //         code: 200,
  //         message: "登录成功",
  //         data: user,
  //       });
  //     } else {
  //       res.json({
  //         code: 400,
  //         message: "用户名或密码错误",
  //       });
  //     }
  //   } catch (error) {
  //     res.json({
  //       code: 500,
  //       message: "登录失败",
  //     });
  //   }
  // },
};

module.exports = userController;
