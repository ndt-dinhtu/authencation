import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Loi khi goi authMe", error.message);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Loi khi lay danh sach nguoi dung", error.message);
    return res.status(500).json({ message: "Loi he thong" });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Cần nhập tên người cần tìm" });
    }
    const user = await User.findOne({ username }).select(
      "_id displayName username avatarUrl",
    );

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi search tên người dùng: ", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
