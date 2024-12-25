import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { ChatPreview } from '@/types/baseTypes';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface MessageComponentProps {
  chat: ChatPreview;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function MessageComponent({
  chat,
  setExpanded,
  className
}: Readonly<MessageComponentProps>) {
  const navigate = useNavigate();
  const { profile } = useAppSelector(state => state.profile);
  return (
    <button
      key={chat.id}
      onClick={() => {
        navigate(`/chat/${chat.id}`);
        setExpanded(false);
      }}
      className={cn(
        'flex items-center gap-4 hover:bg-primary/10 p-2 rounded-lg text-left w-full',
        className
      )}
    >
      <Avatar>
        <AvatarImage
          src={
            (chat.pfp ?? chat.type === 'GROUP')
              ? '/placeholder-user.jpg'
              : '/placeholder-user.jpg'
          }
        />
        <AvatarFallback>
          {chat.type === 'GROUP'
            ? chat.groupName!.charAt(0).toUpperCase()
            : chat.participants
                .find(c => c.username !== profile.username)!
                .name.charAt(0)
                .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="">
        <div className="font-semibold">
          {chat.type === 'GROUP'
            ? chat.groupName
            : chat.participants.find(c => c.username !== profile.username)!
                .name}
        </div>
        <div className="text-sm">{chat.latestMessage.content}</div>
      </div>
    </button>
  );
}
