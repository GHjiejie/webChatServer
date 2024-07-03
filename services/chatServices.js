const chatController = require("../controller/chatController.js");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const chatServices = {
  // 创建私聊房间
  createPrivateRoom: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const result = await chatController.createPrivateRoom(userId, friendId);
      console.log("result", result);
      if (result) {
        res.json({
          code: 200,
          message: "创建私聊房间成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "创建私聊房间失败",
        });
      }
    } catch (error) {}
  },
  // 验证私聊房间是否存在
  verifyPrivateRoom: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const result = await chatController.verifyPrivateRoom(userId, friendId);
      if (result) {
        res.json({
          code: 200,
          message: "私聊房间存在",
          data: result,
        });
      } else {
        res.json({
          code: 404,
          message: "私聊房间不存在",
        });
      }
    } catch (error) {}
  },
  //获取与当前用户有关的所有的会话列表
  getConversationList: async (req, res) => {
    // const { userId } = req.query;
    const { userId } = req.params;
    try {
      const result = await chatController.getConversationList(userId);
      if (result) {
        res.json({
          code: 200,
          message: "获取会话列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取会话列表失败",
        });
      }
    } catch (error) {}
  },
  // 获取选定的会话列表
  getSelectedConversation: async (req, res) => {
    const { conversationId } = req.params;
    try {
      const result = await chatController.getSelectedConversation(
        conversationId
      );
      if (result) {
        res.json({
          code: 200,
          message: "获取选定的会话列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取选定的会话列表失败",
        });
      }
    } catch (error) {}
  },
  // 根据conversationId获取消息列表
  getMessages: async (req, res) => {
    const { conversationId } = req.params;
    console.log("conversationId", conversationId);
    try {
      const result = await chatController.getMessages(conversationId);
      if (result) {
        res.json({
          code: 200,
          message: "获取消息列表成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "获取消息列表失败",
        });
      }
    } catch (error) {}
  },
  // 发送消息
  sendMessage: async (req, res) => {
    const { conversationId, content } = req.body;
    // console.log("conversationId", conversationId);
    // console.log("content", content);
    try {
      const result = await chatController.sendMessage(conversationId, content);
      if (result) {
        res.json({
          code: 200,
          message: "发送消息成功",
          data: result,
        });
      } else {
        res.json({
          code: 500,
          message: "发送消息失败",
        });
      }
    } catch (error) {}
  },
  // 处理聊天过程中发送的文件
  sendFile: async (req, res) => {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ code: 400, message: "缺少文件" });
    }

    const fileType = file.mimetype.startsWith("image") ? "images" : "file";
    const result = await handleUpload(file, fileType);
    res.status(result.code).json(result);
  },

  // 处理聊天过程中发送的文件
  // sendFile: async (req, res) => {
  //   console.log("输出获取的文件", req.file);
  //   const { originalname, mimetype } = req.file;
  //   if (mimetype.startsWith("image")) {
  //     try {
  //       // 压缩图片
  //       const compressedImageBuffer = await sharp(req.file.buffer)
  //         .resize(800, 800, {
  //           fit: sharp.fit.inside,
  //           withoutEnlargement: true,
  //         })
  //         .toFormat("jpeg")
  //         .jpeg({ quality: 80 })
  //         .toBuffer();
  //       // 设置写入磁盘的路径
  //       const filePath = path.join(
  //         process.env.UPLOAD_DIR,
  //         `chatFile/images/${originalname}`
  //       );
  //       await fs.writeFile(filePath, compressedImageBuffer);
  //       // 设置存放到数据库的路径
  //       uploadPath = `${process.env.UPLOAD_DB_URL}/uploads/chatFile/images/${originalname}`;
  //       res.json({
  //         code: 200,
  //         message: "图片上传服务器成功",
  //         data: uploadPath,
  //       });
  //     } catch (error) {
  //       console.log("图片上传服务器失败", error);
  //       res.json({
  //         code: 500,
  //         message: "图片上传服务器失败",
  //         data: error,
  //       });
  //     }
  //   } else {
  //     try {
  //       // 直接把文件写入磁盘
  //       const filePath = path.join(
  //         process.env.UPLOAD_DIR,
  //         `chatFile/file/${originalname}`
  //       );
  //       await fs.writeFile(filePath, req.file.buffer);
  //       // 设置存放到数据库的路径
  //       uploadPath = `${process.env.UPLOAD_DB_URL}/uploads/chatFile/file/${originalname}`;
  //       res.json({
  //         code: 200,
  //         message: "文件上传服务器成功",
  //         data: uploadPath,
  //       });
  //     } catch (error) {
  //       console.log("文件上传服务器失败", error);
  //       res.json({
  //         code: 500,
  //         message: "文件上传服务器失败",
  //         data: error,
  //       });
  //     }
  //   }
  // },
};
const handleUpload = async (file, fileType) => {
  try {
    let fileBuffer = file.buffer;

    // 如果是图片，则进行压缩
    if (fileType === "image") {
      fileBuffer = await sharp(fileBuffer)
        .resize(800, 800, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    // 构建文件路径
    const fileName = `${Date.now()}-${file.originalname}`; // 为文件名添加时间戳避免重复
    const fileDir = path.join(process.env.UPLOAD_DIR, `chatFile/${fileType}`);
    const filePath = path.join(fileDir, fileName);
    const dbPath = `${process.env.UPLOAD_DB_URL}/uploads/chatFile/${fileType}/${fileName}`;

    // 确保目录存在，递归创建目录
    await fs.mkdir(fileDir, { recursive: true });

    // 写入文件
    await fs.writeFile(filePath, fileBuffer);

    return { code: 200, message: "文件上传成功", data: dbPath };
  } catch (error) {
    console.error(`文件上传失败: ${error}`);
    return { code: 500, message: "文件上传失败", data: error };
  }
};

module.exports = chatServices;
