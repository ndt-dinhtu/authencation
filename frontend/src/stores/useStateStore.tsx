import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,
            reset: () => set({ conversations: [], messages: {}, activeConversationId: null, loading: false }),
            setActiveConversation: (id: string | null) => set({ activeConversationId: id }),
            fetchConversations: async () => {
                try {
                    set({ loading: true })
                    const { conversations } = await chatService.fetchConversations()
                    set({ conversations, loading: false })
                    console.log("Conversations fetched:", conversations);
                } catch (error) {
                    console.error("Loi khi lay conversations", error)
                }
            }
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ conversations: state.conversations })
        }
    )
)   