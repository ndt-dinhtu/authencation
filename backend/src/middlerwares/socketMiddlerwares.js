import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token)
      return next(new Error("Authentication error: Token không tồn tại"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.userId) {
      return next(new Error("Authentication error: Token không hợp lệ"));
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user)
      return next(new Error("Authentication error: không tìm thấy user"));

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    console.error("Socket Auth Error:", error.message);
    next(
      new Error(
        "Authentication error: Lỗi khi verify token trong socketMiddleware ",
      ),
    );
  }
};
