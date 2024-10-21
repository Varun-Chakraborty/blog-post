import { cn } from '@/lib/utils';

export function CreatePost({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('h-full w-full box-border', className)}>Create Post</div>
  );
}
