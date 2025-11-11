import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "không thể thiếu username password email firstname lastname",
      });
    }

    // Kiểm tra username hoặc email đã tồn tại
    const duplicateUser = await User.findOne({ username });
    const duplicateEmail = await User.findOne({ email });
    if (duplicateUser || duplicateEmail) {
      return res
        .status(409)
        .json({ message: "Người dùng hoặc email đã tồn tại" });
    }
    //mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10);

    //tạo username mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });
    //return
    return res.status(201).json({ message: "Đăng ký người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error.message);
    res.status(500).json("Lỗi khi gọi signUp");
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy input từ người dùng
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc passwod" });
    }

    //lấy hashedpassword trong database để so sánh pass input

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không đúng" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không đúng" });
    }

    //nếu khớp, tạo accessedToken và jwt ( require('crypto').randomBytes(64).toString('hex'))

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      }
    );

    //tạo refresh token

    const refreshToken = crypto.randomBytes(64).toString("hex");

    //tạo sesion để lưu refresh token

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    user;

    //trả refresh token vào cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    //trả accessekToke  về trong refresh

    return res.status(200).json({
      message: `User ${user.displayName} da login thanh cong`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error.message);
    console.log("ACCESS_TOKEN_SECRET", ACCESS_TOKEN_SECRET);
    res.status(500).json("Lỗi khi gọi signIn");
  }
};
