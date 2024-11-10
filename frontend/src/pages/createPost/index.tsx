import { CreatePostForm } from '@/components/forms';

export function CreatePost({ className }: Readonly<{ className?: string }>) {
  return <CreatePostForm className={className} />;
}
