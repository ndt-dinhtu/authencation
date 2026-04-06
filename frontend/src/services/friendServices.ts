import { api } from "@/lib/axios"

export const friendService = {
    async searchByUserName(username: string) {
        const res = await api.get(`/users/serch?username=${username}`)
        return res.data.user
    },

    async sendFriendRequest(to: string, message?: string) {
        const res = await api.post("/friends/requests", { to, message })
        return res.data.message
    }

}