import { cn } from '@/lib/utils';
import { ChatScreen } from './chatScreen';
import { ChatPreviewScreen } from './chatPreviewScreen';

export function Messages({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('h-full w-full flex', className)}>
      <ChatPreviewScreen />
      <ChatScreen />
    </div>
  );
}
