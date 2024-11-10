import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { UserHoverCard } from '@/components/hoverCard';
import { Profile } from '@/types/baseTypes';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function Card({ profile }: Readonly<{ profile: Profile }>) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/user/${profile.username}`)}
      className="p-3 w-full hover:bg-primary/10 border-b border-borderColor flex gap-3 rounded-lg"
    >
      <Avatar>
        <AvatarImage src={profile.profilePicture ?? '/placeholder-user.jpg'} />
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-bold text-accent group-hover:underline">
          {profile.name}
        </span>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              className="text-sm text-gray-400 block p-0 h-fit"
              variant="link"
            >
              @{profile.username}
            </Button>
          </HoverCardTrigger>
          <UserHoverCard user={profile} />
        </HoverCard>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="h-fit w-full p-2 flex flex-col gap-2">
      <Skeleton className="h-56 w-full rounded" />
      <div className="space-y-1">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton className="h-8 w-8" key={i} />
        ))}
      </div>
    </div>
  );
}
