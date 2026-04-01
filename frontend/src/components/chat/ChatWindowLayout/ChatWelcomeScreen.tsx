import { SidebarInset } from "@/components/ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import { MessageCircleMore } from "lucide-react";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex flex-col w-full h-full bg-transparent overflow-hidden">
      <ChatWindowHeader />

      <div className="flex flex-col bg-primary-foreground/50 backdrop-blur-sm rounded-3xl flex-1 items-center justify-center m-4 border shadow-inner transition-all duration-500">
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative size-32 md:size-40 bg-gradient-chat from-primary to-blue-400 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-background  pulse-ring">
              <MessageCircleMore className="size-16 md:size-20 text-white stroke-[1.5]" />
            </div>
          </div>

          {/* Text Section */}
          <div className="text-center space-y-3 px-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight  bg-gradient-chat bg-clip-text text-transparent">
              Chào mừng bạn đến với Chat
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-[280px] mx-auto leading-relaxed">
              Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu chia sẻ
              những khoảnh khắc.
            </p>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
