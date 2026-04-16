import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddlerwares.js";
import { deleteImageFromCloudinary } from "../middlewares/uploadMiddlerwares.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Loi khi goi authMe", error.message);
    return res.status(500).json({ message: "Loi he thong" });
  }
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

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      {
        new: true,
      },
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "Avatar trả về null" });
    }

    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error("Lỗi xảy ra khi upload avatar", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.hashedPassword = newHashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (user.avatarId) {
      await deleteImageFromCloudinary(user.avatarId);
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie("token");

    return res
      .status(200)
      .json({ message: "Đã xóa tài khoản và dữ liệu liên quan thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống khi xóa tài khoản" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { displayName, bio, phone } = req.body;

    // 1. Tạo object chứa các trường muốn cập nhật
    const updateData = {};
    if (displayName) updateData.displayName = displayName.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (phone) updateData.phone = phone.trim();

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có thông tin nào để thay đổi" });
    }

    // 3. Cập nhật vào Database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-hashedPassword");

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }
    console.error("Lỗi khi cập nhật profile:", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
