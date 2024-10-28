import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUserProfile } from '@/hooks';
import { cn } from '@/lib/utils';
import { ChatPreview } from '@/types';
import { NavLink } from 'react-router-dom';

interface ChatComponentProp {
  chat: ChatPreview;
  className?: string;
}

export function ChatComponent({
  chat,
  className
}: Readonly<ChatComponentProp>) {
  const me = useCurrentUserProfile();
  console.log(chat);
  return (
    <NavLink
      to={`/chat/${chat.id}`}
      className={cn(
        'flex items-center gap-3 border px-4 py-2 rounded-lg text-left relative w-full',
        className
      )}
    >
      <div className="w-1/5">
        <Avatar>
          <AvatarImage src={chat.pfp ?? '/placeholder-user.jpg'} />
          <AvatarFallback>
            {chat.type === 'GROUP'
              ? chat.groupName?.charAt(0).toUpperCase()
              : chat.participants
                  .find(p => p.username !== me!.username)!
                  .name.charAt(0)
                  .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="font-bold">
          {chat.type === 'GROUP'
            ? chat.groupName
            : chat.participants.find(p => p.username !== me!.username)!.name}
        </div>
        <div>{chat.latestMessage?.message}</div>
      </div>
      <div className="absolute right-1 bottom-1 text-sm">
        {new Date(chat.updatedAt).toLocaleTimeString(undefined, {
          hourCycle: 'h12',
          timeStyle: 'short'
        })}
      </div>
    </NavLink>
  );
}
