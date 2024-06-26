const userController = require("../controller/userController");

const userServices = {
  // 用户注册
  register: async (req, res) => {
    try {
      console.log(req.body);
      await userController.register(req, res);
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
  //     await userController.login(req, res);
  //   } catch (error) {
  //     res.json({
  //       code: 500,
  //       message: "登录失败",
  //     });
  //   }
  // },
};

module.exports = userServices;
