import { PostForm } from '@/components/forms';

export function EditPost({ className }: Readonly<{ className?: string }>) {
  return <PostForm className={className} operation='edit' />;
}
