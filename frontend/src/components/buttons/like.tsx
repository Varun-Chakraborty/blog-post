import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function Like({
  liked,
  likesCount,
  onClick,
  className
}: {
  liked: boolean;
  likesCount: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const [likedState, setLikedState] = useState(liked);
  useEffect(() => setLikedState(liked), [liked]);
  return (
    <Button
      className={cn(
        'bg-pink-600 hover:bg-pink-600/80 dark:bg-pink-500 dark:hover:bg-pink-500/80 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 font-montserrat',
        className
      )}
      onClick={onClick}
    >
      {likedState ? 'Unlike' : 'Like'}
      <span className="ml-2">{likesCount}</span>
    </Button>
  );
}
