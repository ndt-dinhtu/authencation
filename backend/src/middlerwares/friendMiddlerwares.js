import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);
export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? null;

    if (!recipientId && !memberIds) {
      return res.status(400).json({
        message:
          "Không có người nhận tin nhắn hoặc thành viên tham gia hội thoại",
      });
    }

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const isFriend = await Friend.findOne({ userA, userB });
      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "Hai người chưa là bạn, chưa thể nhắn tin được" });
      }
      return next();
    }

    const friendCheck = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const friend = await Friend.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendCheck);
    const notFriend = results.filter(Boolean);
    if (notFriend.length > 0) {
      return res.status(403).json({
        message: `Chưa phải bạn bè với những người có id: ${notFriend.join(
          ", "
        )}, chưa thể tạo hội thoại`,
      });
    }
    return next();
  } catch (error) {
    console.error("Lỗi xảy ra khi check bạn bè", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
