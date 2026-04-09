import { useChatStore } from "@/stores/useChatStore.tsx";
import { SidebarInset } from "../ui/sidebar.tsx";
import ChatWelcomeScreen from "./ChatWindowLayout/ChatWelcomeScreen.tsx";
import ChatWindowHeader from "./ChatWindowLayout/ChatWindowHeader.tsx";
import ChatWindowBody from "./ChatWindowLayout/ChatWindowBody.tsx";
import MessageInput from "./ChatWindowLayout/MessageInput.tsx";
import { useEffect } from "react";
import ChatWindowSkeleton from "../sekeleton/ChatWindowSkeleton.tsx";
const ChatWindowLayout = () => {
  const {
    conversations,
    activeConversationId,
    messageLoading: loading,
    markAsSeen,
  } = useChatStore();

  const selectedConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectedConvo) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Lỗi khi markSeen: ", error);
      }
    };

    markSeen();
  }, [selectedConvo, markAsSeen]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* header  */}
      <ChatWindowHeader chat={selectedConvo} />
      {/* body  */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>
      {/* footer  */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
