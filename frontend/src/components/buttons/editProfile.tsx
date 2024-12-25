import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function EditProfile({ className }: Readonly<{ className?: string }>) {
  return (
    <Button
      className={cn(
        'bg-accent text-accent-foreground hover:bg-accent/80 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80 font-semibold p-2 rounded',
        className
      )}
      onClick={() => console.log('edit profile')}
    >
      Edit Profile
    </Button>
  );
}
