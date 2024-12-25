import { HiHome, HiOutlineHome, HiUser, HiOutlineUser } from 'react-icons/hi';
import { MdSpaceDashboard, MdOutlineSpaceDashboard } from 'react-icons/md';
import {
  IoCreate,
  IoCreateOutline,
  IoSettings,
  IoSettingsOutline
} from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { isGuestProfile } from '@/hooks';

const options = [
  {
    id: 1,
    inActiveIcon: HiOutlineHome,
    activeIcon: HiHome,
    title: 'Home',
    route: '/'
  },
  {
    id: 2,
    inActiveIcon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard,
    title: 'Posts',
    route: '/posts',
    isProtected: true
  },
  {
    id: 3,
    inActiveIcon: IoCreateOutline,
    activeIcon: IoCreate,
    title: 'Create Post',
    route: '/post/create',
    isProtected: true
  },
  {
    id: 4,
    inActiveIcon: HiOutlineUser,
    activeIcon: HiUser,
    title: 'Profile',
    route: '/user/me',
    isProtected: true
  },
  {
    id: 5,
    inActiveIcon: IoSettingsOutline,
    activeIcon: IoSettings,
    title: 'Settings',
    route: '/settings'
  }
];

interface Props {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function Menu({ setMenuOpen, className }: Readonly<Props>) {
  const isItGuest = isGuestProfile();
  return (
    <div
      className={cn(
        'w-full box-border rounded-lg overflow-y-auto space-y-1 p-3',
        className
      )}
    >
      {options
        .filter(option => !option.isProtected || !isItGuest)
        .map(option => (
          <NavLink
            key={option.id}
            to={option.route}
            onClick={() => setMenuOpen(false)}
            className={cn(
              'cursor-pointer p-3 rounded-lg flex items-center gap-2 hover:bg-primary/15 dark:hover:bg-primary/30'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive
                  ? option.activeIcon({ className: 'w-6 h-6' })
                  : option.inActiveIcon({ className: 'w-6 h-6' })}
                <span className={cn({ 'font-semibold': isActive })}>
                  {option.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
    </div>
  );
}
