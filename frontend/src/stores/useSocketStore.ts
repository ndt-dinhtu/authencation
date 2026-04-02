import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";


const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
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