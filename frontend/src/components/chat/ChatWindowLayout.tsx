import { useChatStore } from "@/stores/useChatStore.tsx";
import { SidebarInset } from "../ui/sidebar.tsx";
import ChatWelcomeScreen from "./ChatWindowLayout/ChatWelcomeScreen.tsx";
import ChatWindownSkeleton from "./ChatWindowLayout/ChatWindowSkeleton.tsx";
import ChatWindowHeader from "./ChatWindowLayout/ChatWindowHeader.tsx";
import ChatWindowBody from "./ChatWindowLayout/ChatWindowBody.tsx";
import MessageInput from "./ChatWindowLayout/MessageInput.tsx";
const ChatWindowLayout = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    messageLoading: loading,
  } = useChatStore();

  const selectedConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindownSkeleton />;
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
