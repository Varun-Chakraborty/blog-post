import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { MessageComponent } from './messageComponent';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useFetchUnreadChats } from '@/hooks';

function handleClickOutside(
  event: MouseEvent,
  currentComponent: React.RefObject<HTMLDivElement>,
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (
    currentComponent.current &&
    !currentComponent.current.contains(event.target as HTMLDivElement)
  ) {
    setExpanded(false);
  }
}

export function FloatingMessage() {
  const [expanded, setExpanded] = useState(false);
  const [isChatCurrentPath, setIsChatCurrentPath] = useState(false);
  const currentComponent = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useFetchUnreadChats();

  const unreadChats = useAppSelector(state => state.chat.unreadChats);

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setIsChatCurrentPath(currentPath === 'chat');
  }, [location]);

  useEffect(() => {
    document.addEventListener('click', e =>
      handleClickOutside(e, currentComponent, setExpanded)
    );
    return () => {
      document.removeEventListener('click', e =>
        handleClickOutside(e, currentComponent, setExpanded)
      );
    };
  });

  return (
    <div
      ref={currentComponent}
      className={cn(
        'fixed bottom-0 right-3 lg:w-[18%] sm:w-[30%] bg-background z-50 rounded-t-lg sm:block hidden select-none',
        { 'sm:hidden': isChatCurrentPath }
      )}
    >
      <button
        className={cn(
          'flex justify-between items-center cursor-pointer p-3 rounded-t-lg w-full',
          { 'border-b': expanded }
        )}
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <div
            className={cn('h-2 aspect-square bg-accent rounded-full', {
              hidden: !unreadChats.length
            })}
          />
          <span className="text-lg">Messages</span>
        </div>
        <div className="p-2 hover:bg-primary/10 rounded-full">
          <IoChevronDown
            className={cn('w-4 h-4 transition', expanded && 'rotate-180')}
          />
        </div>
      </button>
      <div className={cn('transition-all', !expanded ? 'h-0' : 'h-fit')}>
        <div className="py-2 px-3 space-y-2">
          {unreadChats.map(chat => (
            <MessageComponent
              chat={chat}
              key={chat.id}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
