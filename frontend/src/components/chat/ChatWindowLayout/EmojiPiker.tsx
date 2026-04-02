import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useThemeStore } from "@/stores/useThemeStore";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";

interface EmojiPikerProps {
  onChange: (value: string) => void;
}

const EmojiPiker = ({ onChange }: EmojiPikerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={50}
        className="bg-transparent border-none  shadow-none drop-shadow-none mb-15"
      >
        <Picker
          data={data}
          theme={isDark ? "dark" : "light"}
          onEmojiSelect={(emoji: any) => {
            onChange(emoji.native);
          }}
          emojiSize={24}
        />
      </PopoverContent>
    </Popover>
  ); // Kết thúc ở đây
};
export default EmojiPiker;
