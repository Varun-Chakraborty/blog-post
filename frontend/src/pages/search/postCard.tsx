import { Post } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from './profileCard';

export function PostCard({ post }: Readonly<{ post: Post }>) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/post/${post.id}`)}
      className="p-3 hover:bg-primary/10 border-b border-borderColor cursor-pointer flex gap-3 rounded-lg"
      type="button"
    >
      <ProfileCard profile={post.author} />
    </button>
  );
}
