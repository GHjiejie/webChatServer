const JWT = require("../utils/JWT");

const authMiddleware = (req, res, next) => {
  if (req.url.includes("login") || req.url.includes("register")) {
    console.log("输出当前用户的请求路径", req.url);
    next();
  } else {
    const token = req.headers.authorization;
    if (token) {
      const veriftResult = JWT.verifyToken(token, process.env.JWT_SECRET);
      if (veriftResult) {
        const newToken = JWT.generateToken({
          username: result.username,
          password: result.password,
        });
        res.headers.authorization = newToken;
        next();
      } else {
        res.send(401).json("Invalid token");
      }
    }
  }
};
module.exports = authMiddleware;
