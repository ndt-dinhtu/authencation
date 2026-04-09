import { create } from 'zustand'
import { toast } from "sonner"
import { authService } from '@/services/authServices'
import type { AuthState } from '@/types/store'
import { persist } from 'zustand/middleware'
import { useChatStore } from './useChatStore'


export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        user: null,
        loading: false,

        setAccessToken: (accessToken) => {
            set({ accessToken })
        },
        setUser:(user)=>{
            set({user})
        },

        clearState: () => {
            set({ accessToken: null, user: null, loading: false })
             useChatStore.getState().reset()
            localStorage.clear()
            sessionStorage.clear()
           
        },

        signUp: async (firstname, lastname, username, email, password) => {
            try {
                set({ loading: true })

                await authService.signUp(firstname, lastname, username, email, password)

                toast.success("Đăng kí thành công,Bạn được chuyển sang đăng nhập")
            } catch (error) {
                console.error("Loi khi dang ki", error)
                toast.error("Đăng kí không thành công")
                throw error
            } finally {
                set({ loading: false })
            }
        },

        signIn: async (username, password) => {
            try {
                get().clearState()
                set({ loading: true })
             
                const { accessToken } = await authService.signIn(username, password)
                get().setAccessToken(accessToken)
                await get().fetchMe()
                await useChatStore.getState().fetchConversations()
                toast.success("Chào mừng bạn đã quay trở lại")
            } catch (error) {
                console.error("Loi khi dang nhập", error)
                toast.error("Đăng nhập không thành công")
            } finally {
                set({ loading: false })
            }
        },

        signOut: async () => {
            try {
                get().clearState()
                await authService.signOut();
                toast.success("Logout thành công")
            } catch (error) {
                console.error(error)
                toast.error("Lỗi khi đăng xuất, hay thu lai")

            } finally {
                set({ loading: false })
            }
        },

        fetchMe: async () => {
            try {
                set({ loading: true })
                const user = await authService.fetchMe()
                set({ user })
                console.log(user)
            } catch (error) {
                console.error(error)
                set({ accessToken: null, user: null })
                toast.error("Loi khi lay thong tin nguoi dung, vui long thu lai")
            } finally {
                set({ loading: false })
            }
        },

        refresh: async () => {
            try {
                set({ loading: true })
                const { user, fetchMe, setAccessToken } = get()
                const accessToken = await authService.refersh()
                setAccessToken(accessToken)
                if (!user) {
                    await fetchMe()
                }
            } catch (error) {
                console.error(error)
                toast.error("Phieen lam viêc đã hết hạn, vui lòng đăng nhập lại")
                get().clearState()
            } finally {
                set({ loading: false })
            }

        }
    }), {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user })
    })
)
