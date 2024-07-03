// socket.js
const { Server } = require("socket.io");

const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // 监听加入房间事件
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      // console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
    });

    // 监听私聊消息
    socket.on("privateChat", (content) => {
      // 获取 roomId 和消息内容

      io.to(content.conversationId).emit("chatRes", content); // 向指定房间发送消息
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // 可以在这里添加更多的 Socket.IO 事件处理逻辑
  });

  return io; // 返回 io 实例，方便在其他地方使用,如果没有地方使用的话，直接初始化就好了
};

module.exports = initSocketIO;
