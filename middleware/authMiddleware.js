const JWT = require("../utils/JWT");

const authMiddleware = (req, res, next) => {
  if (req.url.includes("login") || req.url.includes("register")) {
    // console.log("输出当前用户的请求路径", req.url);
    next();
  } else {
    // console.log("输出当前用户的请求路径,需要token", req.url);
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        code: 401,
        message: "用户登录过期,请重新登录",
      });
    }
    try {
      const result = JWT.verifyToken(token, process.env.JWT_SECRET);
      if (result) {
        res.header("Authorization", token);
        next();
      } else {
        return res.json({
          code: 401,
          message: "token验证失败，请重新登录",
        });
      }
    } catch (error) {
      return res.json({
        code: 500,
        message: "服务器内部错误",
      });
    }
    // console.log("输出服务端生成的截取的token", token);

    // if (token !== null) {
    //   const result = JWT.verifyToken(token, process.env.JWT_SECRET);
    //   // console.log("输出token验证的结果", result);
    //   if (result) {
    //     res.header("Authorization", token);
    //     next();
    //   } else {
    //     console.log("token验证失败");
    //   }
    // } else {
    //   res.json({
    //     code: 401,
    //     message: "用户登录过期,请重新登录",
    //   });
    // }
  }
};
module.exports = authMiddleware;
