import { CiBellOn, CiChat1 } from 'react-icons/ci';
import { useNavigate, Outlet } from 'react-router-dom';
import { SearchBar } from '@/components/searchBar';
import { SearchButton } from '@/components/buttons';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { useAppSelector } from '@/hooks';

const pages: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/post/create': 'Create Post',
  '/messages': 'Messages',
  '/notifications': 'Notifications',
  '/search': 'Search',
  '/post': 'Show Post',
  '/settings': 'Settings'
};

interface Props {
  isMenuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RightPanel({ isMenuOpen, setMenuOpen }: Readonly<Props>) {
  const navigate = useNavigate();
  const currentPage = pages[window.location.pathname];
  return (
    <div className="sm:h-full h-svh xl:w-5/6 lg:4/5 sm:2/3 w-full flex flex-col">
      <div className="flex justify-between items-center select-none p-2">
        <div className={cn('text-2xl font-montserrat sm:block hidden')}>
          {currentPage}
        </div>
        <Logo
          isMenuOpen={isMenuOpen}
          setMenuOpen={setMenuOpen}
          className="sm:hidden"
        />
        <div className="flex sm:gap-4 gap-2 items-center">
          <SearchBar className="sm:flex hidden" />
          <SearchButton
            className="sm:hidden"
            onClick={() => navigate('/search')}
          />
          <ChatButton />
          <NotificationsButton />
        </div>
      </div>
      <div className="p-2 overflow-y-auto h-full w-full">
        <div className="bg-card h-full w-full md:rounded-[20px] sm:rounded-[10px] rounded-[5px] shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function ChatButton({ className }: Readonly<{ className?: string }>) {
  const navigate = useNavigate();
  const unreadChats = useAppSelector(state => state.chat.unreadChats);
  return (
    <button
      name="Messages"
      className={cn(
        'p-2 border border-borderColor rounded cursor-pointer hover:bg-primary/10 relative',
        className
      )}
      onClick={() => navigate('/chat')}
      type="button"
    >
      <CiChat1 className="aspect-square sm:h-6 w-5" />
      <div
        className={cn(
          'w-2 h-2 bg-accent rounded-full absolute -top-1 -right-1',
          { hidden: unreadChats.length === 0 }
        )}
      ></div>
    </button>
  );
}

function NotificationsButton({ className }: Readonly<{ className?: string }>) {
  const navigate = useNavigate();
  const notifications = useAppSelector(
    state => state.notification.unreadNotifications
  );
  return (
    <button
      name="Notifications"
      className={cn(
        'p-2 border border-borderColor rounded cursor-pointer hover:bg-primary/10 relative',
        className
      )}
      onClick={() => navigate('/notifications')}
      type="button"
    >
      <CiBellOn className="aspect-square sm:h-6 w-5" />
      <div
        className={cn(
          'w-2 h-2 bg-accent rounded-full absolute -top-1 -right-1',
          { hidden: notifications.length === 0 }
        )}
      ></div>
    </button>
  );
}
