import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";


const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken
        const existingSocket = get().socket;

        if (existingSocket) {
            console.warn("Socket đã tồn tại.");
            return;
        }

        const socket: Socket = io(baseURL, {
            auth: { token: accessToken },
            transports: ['websocket']
        })

        set({ socket })

        socket.on("connect", () => {
            console.log("Kết nối Socket.IO thành công, ID:", socket.id);
        });

        // Lắng nghe sự kiện cập nhật danh sách người dùng trực tuyến
        socket.on("onlineUsers", (usersId) => {
            set({ onlineUsers: usersId });
        });

        //new Message

        socket.on("new-message", ({ message, conversation, unreadCounts }) => {
            useChatStore.getState().addMessage(message)

            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId,
                    displayName: "",
                    avatarUrl: null
                }
            };

            const updateConversation = { ...conversation, lastMessage, unreadCounts }

            if (useChatStore.getState().activeConversationId === message.conversationId) {
                useChatStore.getState().markAsSeen()
            }

            useChatStore.getState().updateConversation(updateConversation)
        })


        //read  Mesaage

        socket.on("read-message", ({ conversation, lastMessage }) => {
            const updated = {
                _id: conversation._id,
                lastMessage,
                lastMessageAt: conversation.lastMessageAt,
                unreadCount: conversation.unreadCounts,
                seenBy: conversation.seenBy
            }
            useChatStore.getState().updateConversation(updated)
        })
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
            console.log("Đã ngắt kết nối Socket.IO");
        }
    }
}))