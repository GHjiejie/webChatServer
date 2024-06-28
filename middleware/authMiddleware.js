const JWT = require("../utils/JWT");

const authMiddleware = (req, res, next) => {
  if (req.url.includes("login") || req.url.includes("register")) {
    // console.log("输出当前用户的请求路径", req.url);
    next();
  } else {
    // console.log("输出当前用户的请求路径,需要token", req.url);
    const token = req.headers.authorization;
    // console.log("输出token", token);
    if (token) {
      next();
      // // 下面的代码有一点问题
      // const veriftResult = JWT.verifyToken(token, process.env.JWT_SECRET);
      // if (veriftResult) {
      //   // 获取当前的时间戳,用于更新用户的token
      //   const currentTime = Date.now();
      //   const newToken = JWT.generateToken(
      //     {
      //       username: result.username,
      //       currentTime,
      //     },
      //     process.env.JWT_SECRET
      //   );
      //   res.header("Authorization", newToken);
      //   next();
      // } else {
      //   res.send(401).json("token验证失败");
      // }
    } else {
      res.json({
        code: 401,
        message: "用户登录过期,请重新登录",
      });
    }
  }
};
module.exports = authMiddleware;
