import { cn } from '@/lib/utils';
import { Profile } from '@/types';
import { NavLink } from 'react-router-dom';

interface ChatPreview {
  id: string;
  sender: Profile;
  lastMessage: string;
  at: string;
}

interface ChatComponentProp {
  chatPreview: ChatPreview;
  className?: string;
}
export function ChatComponent({
  chatPreview,
  className
}: Readonly<ChatComponentProp>) {
  return (
    <NavLink
      to={`/chat/${chatPreview.id}`}
      className={cn(
        'flex items-center gap-3 border px-4 py-2 rounded-lg text-left relative w-full',
        className
      )}
    >
      <div className="w-1/5">
        <img
          src={chatPreview.sender.pfp ?? '/placeholder-user.jpg'}
          alt=""
          className="w-full rounded-full border"
        />
      </div>
      <div>
        <div className="font-bold">@{chatPreview.sender.username}</div>
        <div className="text-sm">{chatPreview.lastMessage}</div>
      </div>
      <div className="absolute right-1 bottom-1 text-sm">{chatPreview.at}</div>
    </NavLink>
  );
}
