import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Loi khi goi authMe", error);
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
    console.error("Loi khi lay danh sach nguoi dung", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};
