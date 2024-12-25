import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { socketService } from "@/services";
import { Chat } from "@/types/baseTypes";
import { IoSend } from "react-icons/io5";

interface NewMessageProps {
    chatId?: string;
    setChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
    className?: string;
  }
  
  export function NewMessage({ chatId, className }: Readonly<NewMessageProps>) {
    const myUserName = useAppSelector(state => state.profile).profile.username;
    let timeOut: NodeJS.Timeout | undefined = undefined;
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          if (myUserName) {
            const inputElement = e.currentTarget[0] as HTMLInputElement;
            const message = inputElement.value;
            if (chatId && message) {
              socketService.sendMessage(chatId, message);
              e.currentTarget.reset();
            }
          }
        }}
        className={cn('flex items-center gap-2 p-2', className)}
      >
        <input
          type="text"
          placeholder="Enter your message"
          className="p-2 rounded-lg w-full outline-none selection:bg-slate-300 bg-inherit"
          onChange={() => {
            if (timeOut) clearTimeout(timeOut);
            socketService.emitTyping();
            timeOut = setTimeout(() => socketService.emitStoppedTyping(), 1000);
          }}
        />
        <button
          type="submit"
          className="bg-accent text-accent-foreground aspect-square flex justify-center items-center rounded-full hover:bg-accent/80 p-2"
        >
          <IoSend />
        </button>
      </form>
    );
  }