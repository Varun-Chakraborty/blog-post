import { PostForm } from '@/components/forms';

export function CreatePost({ className }: Readonly<{ className?: string }>) {
  return <PostForm className={className} operation="create" />;
}
