const express = require("express");
const router = express.Router();
const multer = require("multer");

const userServices = require("../services/userServices");
// 设置用户头像存储方式
// const newAvatarStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/avatar");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// // 创建上传实例;
// const uploadNewAvatar = multer({ storage: newAvatarStorage });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// 用户注册
router.post("/register", userServices.register);

// 用户登录
router.post("/login", userServices.login);

// 根据用户的ID获取用户信息
router.get("/info/:userId", userServices.info);

// 搜索好友
router.get("/searchFriend/:keywords", userServices.searchFriend);

// 更新用户信息
router.post(
  "/updateUserInfo",
  // uploadNewAvatar.single("newAvatar"),
  upload.single("newAvatar"),
  userServices.updateUserInfo
);

// 添加好友至好友申请列表
router.post("/friendRequest", userServices.friendRequest);

// 同意好友申请
router.post("/acceptFriendRequest", userServices.acceptFriendRequest);

// 拒绝好友申请
router.post("/rejectFriendRequest", userServices.rejectFriendRequest);

// router.post("/addFriend", userServices.addFriend);

module.exports = router;
