const express = require("express");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const db = require("./config/db");
const initRoutes = require("./routes");
require("dotenv").config();
const { Server } = require("socket.io");
const { createMessage } = require("./services/message");

const app = express();
const server = createServer(app);
const io = Server(server);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 1905;
db();
initRoutes(app);

io.on("connection", (socket) => {
  function getReceiverSocketById(id) {
    return io.sockets.sockets[id];
  }
  socket.on("sendMessage", async (message) => {
    const { content, author, chatId } = message;

    try {
      const ms = await createMessage(message);

      socket.to(chatId).emit("receiveMessage", ms);
    } catch (error) {
      // console.error("Error saving message to DB:", error);
      socket.to(chatId).emit("error", "Failed to save message to database");
    }
  });
  socket.on("joinChatRoom", (chatId) => {
    socket.join(chatId);
  });
  socket.on("leaveChatRoom", (chatId) => {
    socket.leave(chatId);
  });
});

server.listen(PORT, () => {
  console.log(`Hello NodeJS in port ${PORT}`);
});
