const jsonwebtoken = require("jsonwebtoken");
const JWT = {
  // 生成token
  generateToken: (data) => {
    // data是一个对象
    const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
  },
  // 验证token
  verifyToken: (token) => {
    try {
      const result = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      return result;
    } catch (error) {
      return false;
    }
  },
};
module.exports = JWT;
