import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;
    if (
      !type ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0 ||
      (type === "group" && !name)
    ) {
      return res
        .status(400)
        .json({ message: "Tên nhóm và danh sách thành viên là bắt buộc" });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });
        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: { name, createdBy: userId },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation) {
      return res
        .status(400)
        .json({ message: "Thông tin conversation type không hợp lệ" });
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    const participants = (conversation.participants || []).map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formatted = { ...conversation.toObject(), participants };

    if (type === "group") {
      const participantIds = [userId, ...memberIds].map((id) => id.toString());
      const uniqueParticipantIds = [...new Set(participantIds)];
      uniqueParticipantIds.forEach((participantId) => {
        io.to(participantId).emit("new-group", formatted);
      });
    }

    return res.status(201).json({ conversation: formatted });
  } catch (error) {
    console.error("Lỗi khi createConversation", error);
    return res.status(500).json({ message: "Lỗi hệ thông" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({ path: "seenBy", select: "displayName avatarUrl" })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      });

    const formatted = conversations.map((conversation) => {
      const participants = (conversation.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));

      return {
        ...conversation.toObject(),
        participants,
      };
    });
    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.log("Lỗi khi getConversation", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 2, cursor } = req.query;

    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({ messages, nextCursor });
  } catch (error) {
    console.error("Lỗi khi getMessage", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserConversationsForSocketIo = async (userId) => {
  try {
    const conversation = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );
    return conversation.map((c) => c._id.toString());
  } catch (error) {
    console.error(
      `Co lỗi xảy ra khi lấy getUserConversationsForSocketIo ${error}`,
    );
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Khoong tìm thấy cuộc trò chuyện" });
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res
        .status(200)
        .json({ message: "Không có tin nhắn đề mark as seen" });
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({ message: "Sender không cần mark as seen" });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      {
        new: true,
      },
    );

    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        lastMessageAt: updated?.lastMessage.lastMessageAt,
        sender: {
          _id: updated?.lastMessage.senderId,
        },
      },
    });

    return res.status(200).json({
      message: "Mark as seen",
      seenBy: updated?.seenBy || [],
      unreadCount: updated?.unreadCounts[userId],
    });
  } catch (error) {
    console.error("Lỗi khi chạy hàm MarkAsSeen, ", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
