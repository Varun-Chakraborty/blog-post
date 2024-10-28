import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ChatPreview } from '@/types';
import { useCurrentUserProfile } from '@/hooks';
import { ChatScreen } from './chatScreen';
import { ChatPreviewScreen } from './chatPreviewScreen';
import api from '@/api';

export function Messages({ className }: Readonly<{ className?: string }>) {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const me = useCurrentUserProfile();

  useEffect(() => {
    api
      .getChats(me!.username)
      .then(res => setChats(res))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className={cn('h-full w-full flex', className)}>
      <ChatPreviewScreen chats={chats} setChats={setChats} />
      <ChatScreen />
    </div>
  );
}
