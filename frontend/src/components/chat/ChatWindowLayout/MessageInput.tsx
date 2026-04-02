import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { ImagePlus, Send } from "lucide-react";
import React, { useState } from "react";
import EmojiPiker from "./EmojiPiker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  console.log(user);
  const [value, setValue] = useState("");
  if (!user) return null;

  const sendMessage = async () => {
    if (!value.trim()) return;
    try {
      if (selectedConvo.type === "direct") {
        const participant = selectedConvo.participants;
        const otherUser = participant.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, value);
      } else {
        await sendGroupMessage(selectedConvo._id, value);
      }
    } catch (error) {
      toast.error("Loi khi gui tin nhan, vui long thu lai");
      console.error("Loi khi gui tin nhan", error);
    } finally {
      setValue("");
    }
  };
  const handleOnKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
          onKeyDown={handleOnKeyPress}
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
              <EmojiPiker
                onChange={(emoji: string) => setValue(`${value}${emoji}`)}
              />
            </div>
          </Button>
        </div>
      </div>
      <Button
        onClick={sendMessage}
        disabled={!value.trim()}
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:cursor-pointer hover:scale-109"
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
