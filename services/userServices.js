const userController = require("../controller/userController");

const userServices = {
  // 用户注册
  register: async (req, res) => {
    try {
      const hasUser = await userController.verify(req.body.username);
      if (!hasUser) {
        const result = await userController.register(req);
        if (result.code === 200) {
          res.json({
            code: result.code,
            message: result.message,
            data: result.data,
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
      // console.log("req", req.body);
      const result = await userController.login(req, res);
      res.json({
        code: result.code,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      res.json({
        code: 500,
        message: "登录失败",
      });
    }
  },
};

module.exports = userServices;
