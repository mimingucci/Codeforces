const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const db = require("./config/db");
const initRoutes = require("./routes");
require("dotenv").config();
const { Server } = require("socket.io");
const { getByChat, save } = require("./repositories/message");
const { getAllUsers } = require("./repositories/chat");
const fileparser = require("./config/fileparser");
const passport = require("passport");
const { verifyAccessToken } = require("./middlewares/verifyToken");
require("./config/passport")(passport);
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URL_REACT_APP,
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: process.env.URL_REACT_APP }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 1905;
db();
initRoutes(app);

app.post("/api/file/upload", [verifyAccessToken], async (req, res) => {
  await fileparser(req)
    .then((data) => {
      res.status(200).json({
        status: "success",
        data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "failure",
        data: error,
      });
    });
});

const CHAT_BOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id !== userID);
}

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  // Add a user to a room
  socket.on("join_room", (data) => {
    const { username, userId, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room

    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      content: `${username} has joined the chat room`,
      author: { username: CHAT_BOT },
      createdAt: __createdtime__,
    });
    // Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      content: `Welcome ${username}`,
      author: { username: CHAT_BOT },
      createdAt: __createdtime__,
    });
    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room, userId });
    let chatRoomUsers = allUsers.filter((user) => user.room === room);
    getAllUsers(room).then((rs) => {
      socket.to(room).emit("chatroom_users", rs);
      socket.emit("chatroom_users", rs);
    });
    // socket.to(room).emit("chatroom_users", chatRoomUsers);
    // socket.emit("chatroom_users", chatRoomUsers);

    // Get last 100 messages sent in the chat room
    getByChat(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on("send_message", (data) => {
    const { message, username, room, userId, __createdtime__ } = data;
    io.in(room).emit("receive_message", {
      content: message,
      author: { username: username },
      createdAt: new Date(),
    }); // Send to all users in room, including sender
    save({ content: message, author: userId, chat: room }) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from the chat");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Hello NodeJS in port ${PORT}`);
});
