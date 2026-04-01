import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "../UserAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MessageItemsProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItems = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemsProps) => {
  const pre = messages[index - 1];

  const isGroupBreak =
    index === 0 ||
    message.senderId !== pre?.senderId ||
    new Date(message.createdAt).getTime() -
      new Date(pre?.createdAt || 0).getTime() >
      300000; // 5 phút

  const participant = selectedConvo.participants.find(
    (p: Participant) =>
      p._id.toString() === message.senderId.toString()
  );

  return (
    <div
      className={cn(
        "flex gap-2 mb-2 message-bounce w-full",
        message.isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!message.isOwn ? (
        <div className="w-8 shrink-0">
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              name={participant?.displayName ?? "Moji"}
              avatarUrl={participant?.avatarUrl ?? undefined}
            />
          )}
        </div>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      {/* Nội dung */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          message.isOwn ? "items-end" : "items-start"
        )}
      >
        {/* TIME (TRÊN - CENTER) */}
        {isGroupBreak && (
          <div className="w-full flex justify-center mb-1">
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {formatMessageTime(new Date(message.createdAt))}
            </span>
          </div>
        )}

        {/* MESSAGE */}
        <div className="flex items-center gap-2">
          <Card
            className={cn(
              "p-3 rounded-2xl",
              message.isOwn
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-secondary rounded-tl-none"
            )}
          >
            <p className="text-sm leading-relaxed">
              {message.content}
            </p>
          </Card>
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2 mt-1">
          {message.isOwn &&
            message._id === selectedConvo.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1 h-3 border-0 uppercase font-bold",
                  lastMessageStatus === "seen"
                    ? "text-blue-500"
                    : "text-muted-foreground"
                )}
              >
                {lastMessageStatus}
              </Badge>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageItems;