const userController = require("../controller/userController");
const JWT = require("../utils/JWT");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
// 解释 __dirname: 当前模块的目录名, 也就是当前文件所在的目录,这里时services目录，所以我们要使用../来返回上一级目录
// const uploadDir = path.join(__dirname, "../public/uploads/avatar");

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
  updateUserInfo: async (req, res) => {
    const { userId, username, phone } = req.body;
    let { avatar } = req.body; // 使用 let 声明 avatar

    try {
      if (req.file) {
        // 使用更简洁的图片处理方式
        const processedImage = await sharp(req.file.buffer)
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = path.join(process.env.UPLOAD_DIR, "avatar", fileName);
        const dbPath = `${process.env.UPLOAD_DB_URL}/uploads/avatar/${fileName}`;

        // 确保目录存在
        await fs.mkdir(path.join(process.env.UPLOAD_DIR, "avatar"), {
          recursive: true,
        });

        await fs.writeFile(filePath, processedImage);

        avatar = dbPath; // 更新 avatar 为数据库路径
      }

      // 更新用户信息
      const updateResult = await userController.updateUserInfo(
        userId,
        username,
        avatar, // 使用更新后的 avatar
        phone
      );

      if (updateResult) {
        return res.json({ code: 200, message: "更新用户信息成功" });
      }

      // 不需要 else，直接返回错误信息
      res.status(500).json({ code: 500, message: "更新用户信息失败" });
    } catch (error) {
      console.error("更新用户信息时出错:", error);
      res.status(500).json({ code: 500, message: "更新用户信息时出错" });
    }
  },

  // 更新用户信息
  // updateUserInfo: async (req, res) => {
  //   const { userId, username, avatar, phone } = req.body;

  //   try {
  //     let filePath = avatar; // 默认使用传入的 avatar
  //     let uploadPath = "";

  //     if (req.file) {
  //       // 压缩图像
  //       const compressedImageBuffer = await sharp(req.file.buffer)
  //         .resize(800, 800, {
  //           fit: sharp.fit.inside,
  //           withoutEnlargement: true,
  //         })
  //         .toFormat("jpeg")
  //         .jpeg({ quality: 80 })
  //         .toBuffer();

  //       const timestamp = Date.now();
  //       // 生成文件路径
  //       filePath = path.join(
  //         // process.env.SERVER_URL,
  //         process.env.UPLOAD_DIR,
  //         "avatar",
  //         `${timestamp}-${req.file.originalname}`
  //       );
  //       await fs.writeFile(filePath, compressedImageBuffer);
  //       uploadPath = `${process.env.UPLOAD_DB_URL}/uploads/avatar/${timestamp}-${req.file.originalname}`;
  //       filePath = uploadPath;
  //       // console.log("上传到服务器的文件路径", filePath);

  //       // 将文件写入磁盘
  //     }

  //     // 更新用户信息
  //     const updateResult = await userController.updateUserInfo(
  //       userId,
  //       username,
  //       filePath,
  //       phone
  //     );

  //     if (updateResult) {
  //       res.json({
  //         code: 200,
  //         message: "更新用户信息成功",
  //       });
  //     } else {
  //       res.json({
  //         code: 500,
  //         message: "更新用户信息失败",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating user info:", error);
  //     res.json({
  //       code: 500,
  //       message: "更新用户信息时出错",
  //     });
  //   }
  // },
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
