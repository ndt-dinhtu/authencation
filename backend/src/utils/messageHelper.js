import Conversation from "../models/Conversation.js";

export const updateConversationAfterCreateMessage = async (
  conversation,
  message,
  senderId,
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((p) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

// export const emitNewMessages = async (io, conversation, message) => {
//   io.to(conversation._id.toString()).emit("new-message", {
//     message,
//     conversation: {
//       _id: conversation._id,
//       lastMessage: conversation.lastMessage,
//       lastMessageAt: conversation.lastMessageAt,
//     },
//     unreadCounts: conversation.unreadCounts,
//   });
// };

export const emitNewMessages = async (io, conversation, message) => {
  const roomId = conversation._id.toString();

  console.log("--- Bắt đầu Emit Socket ---");
  console.log("Phát tới Room ID:", roomId);
  console.log("Nội dung tin nhắn:", {
    id: message._id,
    content: message.content,
    sender: message.senderId,
  });
  console.log("Trạng thái Sidebar mới:", {
    lastMsg: conversation.lastMessage.content,
    updatedAt: conversation.lastMessageAt,
  });
  console.log(
    "Bảng số tin chưa đọc (unreadCounts):",
    Object.fromEntries(conversation.unreadCounts), 
  );

  io.to(roomId).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: conversation.unreadCounts,
  });

  console.log("--- Emit thành công ---");
};
