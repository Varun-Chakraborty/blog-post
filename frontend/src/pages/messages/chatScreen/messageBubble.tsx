import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { Message } from '@/types/baseTypes';
import { Link } from 'react-router-dom';

interface MessageBubbleProp {
  message: Message;
  isItGroup: boolean;
  className?: string;
}

export function MessageBubble({
  message,
  isItGroup,
  className
}: Readonly<MessageBubbleProp>) {
  const { profile } = useAppSelector(state => state.profile);
  const isItFromMe = profile.username === message.author.username;
  return (
    <button
      className={cn(
        'text-left relative min-w-52 max-w-60 w-fit border rounded-lg px-4 py-2 hover:bg-inherit/80 hover:dark:bg-inherit/80',
        {
          'bg-green-200 dark:bg-green-800 hover:bg-green-200/80 hover:dark:bg-green-800/80 right-0 self-end':
            isItFromMe
        },
        className
      )}
    >
      {isItGroup && !isItFromMe && (
        <Link
          to={`/user/${message.author.username}`}
          className="block hover:underline"
        >{`@${message.author.username}`}</Link>
      )}
      <span className="text-lg">{message.content}</span>
      <div className="absolute bottom-1 right-1 text-xs">
        {new Date(message.updatedAt).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </button>
  );
}
