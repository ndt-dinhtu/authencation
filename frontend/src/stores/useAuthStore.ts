import { create } from 'zustand'
import { toast } from "sonner"
import { authService } from '@/services/authServices'
import type { AuthState } from '@/types/store'


export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    signUp: async (firstname, lastname, username, email, password) => {
        try {
            set({ loading: true })

            await authService.signUp(firstname, lastname, username, email, password)

            toast.success("Đăng kí thành công,Bạn được chuyển sang đăng nhập")
        } catch (error:any) {
            console.error("Loi khi dang ki", error)
            toast.error("Đăng kí không thành công")
            throw error  
        } finally {
            set({ loading: false })
        }
    }
}))
