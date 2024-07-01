// socket.js
const { Server } = require("socket.io");

const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("join", (msg) => {
      console.log("message: " + msg);
      io.emit("chatRes", "我是服务器，我收到了客户端的消息");
    });

    // 可以在这里添加更多的 Socket.IO 事件处理逻辑
  });

  return io; // 返回 io 实例，方便在其他地方使用,如果没有地方使用的话，直接初始化就好了
};

module.exports = initSocketIO; 
