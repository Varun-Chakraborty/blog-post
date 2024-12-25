import { CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { HoverCardContent } from '../ui/hover-card';
import { Profile } from '@/types/baseTypes';
import { cn } from '@/lib/utils';

export function UserHoverCard({
  user,
  className
}: Readonly<{ user: Profile; className?: string }>) {
  return (
    <HoverCardContent className={cn('w-80', className)}>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.profilePicture ?? '/placeholder-user.jpg'} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@{user.username}</h4>
          {user.bio && <p className="text-sm">{user.bio}</p>}
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
            <span className="text-xs text-muted-foreground">
              Joined{' '}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  );
}
