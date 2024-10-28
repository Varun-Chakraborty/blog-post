import api from '@/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUserProfile } from '@/hooks';
import { cn } from '@/lib/utils';
import { Chat, Message } from '@/types';
import { useEffect, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function ChatScreen({
  className
}: Readonly<{
  className?: string;
}>) {
  const [chat, setChat] = useState<Chat | undefined>();
  const [isItGroup, setIsItGroup] = useState(false);
  const navigate = useNavigate();
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const location = useLocation();
  const me = useCurrentUserProfile();

  useEffect(() => {
    const newChatID = location.pathname.split('/')[2] || undefined;
    if (currentChatId !== newChatID) setCurrentChatId(newChatID);
  }, [location]);

  useEffect(() => {
    if (!currentChatId) return;
    api
      .getChatById(currentChatId)
      .then(chat => {
        setChat(chat);
        if (chat) setIsItGroup(chat.type === 'GROUP');
      })
      .then(e => console.error(e));
  }, [currentChatId]);

  api.socket.on('new-message', (message: Message) => {
    setChat(
      prev => prev && { ...prev, messages: [...(prev.messages ?? []), message] }
    );
  });

  const renderNoChatMessage = !chat ? (
    <div
      className={cn(
        'w-full flex justify-center items-center text-2xl',
        className
      )}
    >
      No chat selected yet
    </div>
  ) : null;

  return (
    renderNoChatMessage ?? (
      <div className={cn('w-full flex flex-col', className)}>
        <div className="px-2 flex justify-between w-full border-b p-2">
          <button
            onClick={() => navigate('..')}
            className="hover:bg-primary/10 rounded-full aspect-square flex justify-center items-center"
          >
            <HiArrowLeft />
          </button>
          <button
            onClick={() =>
              isItGroup ||
              navigate(
                `/user/${chat!.clients.find(c => c.username !== me!.username)!.username}`
              )
            }
            className="flex gap-2 items-center hover:bg-primary/10 px-2 py-1 rounded-lg"
          >
            <Avatar>
              <AvatarImage
                src={
                  (chat!.pfp ?? isItGroup)
                    ? '/placeholder-user.jpg'
                    : '/placeholder-user.jpg'
                }
              />
              <AvatarFallback>
                {isItGroup
                  ? chat!.clients.find(c => c.username !== me!.username)!.name
                  : chat!.groupName}
              </AvatarFallback>
            </Avatar>
            <div className={cn({ uppercase: isItGroup })}>
              {isItGroup
                ? chat!.clients.find(c => c.username !== me!.username)!.name
                : chat!.groupName}
            </div>
          </button>
          <div />
        </div>
        <div className="h-full overflow-y-auto flex flex-col justify-end gap-3 p-4 overscroll-none">
          {chat!.messages.map(message => (
            <MessageBubble
              message={message}
              key={message.id}
              isItGroup={isItGroup}
            />
          ))}
          <NewMessageBubble />
        </div>
        <NewMessage chatId={chat!.id} setChat={setChat} className="border-t" />
      </div>
    )
  );
}

interface MessageBubbleProp {
  message: Chat['messages'][0];
  isItGroup: boolean;
  className?: string;
}
function MessageBubble({
  message,
  isItGroup,
  className
}: Readonly<MessageBubbleProp>) {
  const isItFromMe = useCurrentUserProfile()?.username === message.sentBy;
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
          to={`/user/${message.sentBy}`}
          className="block hover:underline"
        >{`@${message.sentBy}`}</Link>
      )}
      <span className="text-lg">{message.message}</span>
      <div className="absolute bottom-1 right-1 text-xs">
        {message.updatedAt}
      </div>
    </button>
  );
}

interface NewMessageProps {
  chatId: string;
  setChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  className?: string;
}

function NewMessage({ chatId, className }: Readonly<NewMessageProps>) {
  const myUserName = useCurrentUserProfile()?.username;
  let timeOut: NodeJS.Timeout | undefined = undefined;
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (myUserName) {
          const inputElement = e.currentTarget[0] as HTMLInputElement;
          const message = inputElement.value;
          api.socket.emit('new-message', message);
          e.currentTarget.reset();
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
          api.socket.emit('typing');
          timeOut = setTimeout(() => api.socket.emit('stoppedTyping'), 1000);
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

function NewMessageBubble({ className }: Readonly<{ className?: string }>) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    api.socket.on('typing', () => setIsTyping(true));
    api.socket.on('stoppedTyping', () => setIsTyping(false));
    return () => {
      api.socket.off('typing');
      api.socket.off('stoppedTyping');
    };
  }, []);

  return (
    isTyping && (
      <div
        className={cn(
          'text-left relative w-fit border rounded-lg px-4 py-2 hover:bg-inherit/80 hover:dark:bg-inherit/80 flex gap-1',
          className
        )}
      >
        <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500" />
        <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-150" />
        <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-300" />
      </div>
    )
  );
}
