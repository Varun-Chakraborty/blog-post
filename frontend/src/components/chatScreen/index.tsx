import api from '@/api';
import { useMyProfile } from '@/hooks/useMyProfile';
import { cn } from '@/lib/utils';
import { Profile } from '@/types';
import { useEffect, useState } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  message: string;
  sentBy: string;
  at: string;
}

interface Group {
  name: string;
  pfp?: string;
}

interface Chat {
  id: string;
  type: 'CHAT' | 'GROUP';
  sender?: Profile;
  groupDetail?: Group;
  messages: Message[];
}

const chats: Chat[] = [
  {
    id: '2',
    type: 'GROUP',
    sender: {
      id: '1',
      username: 'john',
      name: 'John Doe'
    },
    groupDetail: {
      name: 'group'
    },
    messages: [
      {
        id: '1',
        message: 'hi',
        sentBy: 'johnDoe',
        at: '1:01pm'
      },
      {
        id: '2',
        message: 'hey',
        sentBy: 'varun',
        at: '1:02pm'
      },
      {
        id: '3',
        message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        sentBy: 'jane',
        at: '1:02pm'
      }
    ]
  }
];

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

  useEffect(() => {
    const newChatID = location.pathname.split('/')[2];
    if (currentChatId !== newChatID) setCurrentChatId(newChatID || undefined);
  }, [location]);

  useEffect(() => {
    const chat = chats.find(chat => chat.id === currentChatId);
    setChat(chat);
    if (chat) setIsItGroup(chat.type === 'GROUP');
  }, [currentChatId]);

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
              isItGroup || navigate(`/user/${chat!.sender!.username}`)
            }
            className="flex gap-2 items-center hover:bg-primary/10 px-2 py-1 rounded-lg"
          >
            <img
              src={
                isItGroup
                  ? (chat!.groupDetail!.pfp ?? '/placeholder-user.jpg')
                  : (chat!.sender!.pfp ?? '/placeholder-user.jpg')
              }
              alt=""
              className="rounded-full h-10 border"
            />
            <div className={cn({ uppercase: isItGroup })}>
              {isItGroup ? chat!.groupDetail!.name : chat!.sender!.name}
            </div>
          </button>
          <div></div>
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
  const isItFromMe = useMyProfile()?.username === message.sentBy;
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
      <div className="absolute bottom-1 right-1 text-xs">{message.at}</div>
    </button>
  );
}

interface NewMessageProps {
  chatId: string;
  setChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  className?: string;
}

function NewMessage({ chatId, setChat, className }: Readonly<NewMessageProps>) {
  const myUserName = useMyProfile()?.username;
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (myUserName) {
          const inputElement = e.currentTarget[0] as HTMLInputElement;
          const message = inputElement.value;
          const newMessage: Message = {
            id: '6',
            message: message,
            sentBy: myUserName,
            at: new Date().toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: '2-digit'
            })
          };
          api.sendMessage(chatId, message);
          e.currentTarget.reset();
          setChat(chat => ({
            ...chat!,
            messages: [...chat!.messages, newMessage]
          }));
        }
      }}
      className={cn('flex items-center gap-2 p-2', className)}
    >
      <input
        type="text"
        placeholder="Enter your message"
        className="p-2 rounded-lg w-full outline-none selection:bg-slate-300 bg-inherit"
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
  return (
    <div
      className={cn(
        'text-left relative w-fit border rounded-lg px-4 py-2 hover:bg-inherit/80 hover:dark:bg-inherit/80 flex gap-1',
        className
      )}
    >
      <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500"></div>
      <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-150"></div>
      <div className="rounded-full bg-gray-600 aspect-square h-2 animate-pulse duration-500 delay-300"></div>
    </div>
  );
}
