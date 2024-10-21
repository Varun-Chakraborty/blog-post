import { cn } from '@/lib/utils';
import { ChatComponent } from './chatComponent';
import { Outlet, useLocation } from 'react-router-dom';

const chatPreviews = [
  {
    id: '1',
    sender: { id: '1', name: 'John doe', username: 'john' },
    lastMessage: 'Hey!!',
    at: '1:02pm'
  },
  {
    id: '2',
    sender: { id: '2', name: 'Jane doe', username: 'jane' },
    lastMessage: 'Hey!!',
    at: '1:02pm'
  }
];

export function Messages({ className }: Readonly<{ className?: string }>) {
  const location = useLocation();
  const isItRoot = location.pathname.endsWith('/chat');
  return (
    <div className={cn('h-full w-full flex', className)}>
      <div
        className={cn(
          'border-r p-4 space-y-2 w-1/5 shrink-0 sm:block sm:w-auto hidden',
          { 'block w-full': isItRoot }
        )}
      >
        {chatPreviews.map(chatPreview => (
          <ChatComponent chatPreview={chatPreview} key={chatPreview.id} />
        ))}
      </div>
      <Outlet />
    </div>
  );
}
