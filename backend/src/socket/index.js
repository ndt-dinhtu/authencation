import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlerwares/socketMiddlerwares.js";
import { getUserConversationsForSocketIo } from "../controller/conversationController.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);
const onlineUsers = new Map();

io.on("connection", async (socket) => {
  const user = socket.user;
  console.log("--------------------------------------------------");
  console.log(`socket connected: ${socket.id}`);
  console.log(`${user.displayName}: ${socket.userId}`);

  onlineUsers.set(user._id, socket.id);
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  const conversationsId = await getUserConversationsForSocketIo(user._id);

  conversationsId.forEach((id) => {
    socket.join(id);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("socket disconnected:", socket.id);
  });
});

export { io, app, server };
