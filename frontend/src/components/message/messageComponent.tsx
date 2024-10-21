import { cn } from '@/lib/utils';
import { Profile } from '@/types';
import { useNavigate } from 'react-router-dom';

export interface Message {
  id: string;
  sender: Profile;
  message: string;
  chatId: string;
}

interface MessageComponentProps {
  message: Message;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function MessageComponent({
  message,
  setExpanded,
  className
}: Readonly<MessageComponentProps>) {
  const navigate = useNavigate();
  return (
    <button
      key={message.id}
      onClick={() => {
        navigate(`/chat/${message.chatId}`);
        setExpanded(false);
      }}
      className={cn(
        'flex items-center gap-4 hover:bg-primary/10 p-2 rounded-lg text-left',
        className
      )}
    >
      <img
        src={message.sender.pfp ?? '/placeholder-user.jpg'}
        alt=""
        className="h-10 aspect-square rounded-full"
      />
      <div className="">
        <div className="font-semibold">{message.sender.name}</div>
        <div className="text-sm">{message.message}</div>
      </div>
    </button>
  );
}
