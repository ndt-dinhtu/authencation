import { friendService } from '@/services/friendServices';
import type { FriendState } from "@/types/store"
import { create } from "zustand"

export const useFriendStore = create<FriendState>((set, get) => ({
    loading: false,
    searchByUsername: async (username) => {
        try {
            set({ loading: true })
            const user = await friendService.searchByUserName(username)
            return user
        } catch (error) {
            console.error("Loi xay ra khi tim user bang username: ", error)
            return null
        } finally {
            set({ loading: false })
        }
    },
    addFriend: async (to, message) => {
        try {
            set({ loading: true })
            const resultMessage = await friendService.sendFriendRequest(to, message)
            return resultMessage
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            console.error("Lỗi gửi lời mời:", errorMsg);
            throw new Error(errorMsg)
        } finally {
            set({ loading: false })
        }
    }
}))