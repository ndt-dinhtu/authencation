import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { ImagePlus, Send } from "lucide-react";
import { useState } from "react";
import EmojiPiker from "./EmojiPiker";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  console.log(user);
  const [value, setValue] = useState("");
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 p-3 min-h-[14] bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/20 transition-smooth"
      >
        <ImagePlus className="size-9" />
      </Button>
      <div className="flex-1 relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhap tin nhan"
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
        ></Input>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8  hover:bg-primary/20 transition-smooth"
          >
            <div>
              <EmojiPiker onChange={(emoji:string) => setValue(`${value}${emoji}`)} />
            </div>
          </Button>
        </div>
      </div>
      <Button
        disabled={!value.trim()}
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:cursor-pointer hover:scale-109"
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
