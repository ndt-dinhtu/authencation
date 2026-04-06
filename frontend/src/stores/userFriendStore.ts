import { friendService } from '@/services/friendServices';
import type { FriendState } from "@/types/store"
import { create } from "zustand"

export const useFriendStore = create<FriendState>((set, get) => ({
    loading: false,
    searchByUserName: async (username) => {
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
            console.error("loi xay ra khi gui loi moi ket ban: ", error)
            return null
        } finally {
            set({ loading: false })
        }
    }
}))