import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getPosts = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true }
  });

  if (!user)
    return new ApiResponse('User not found', undefined, 404).error(res);

  const posts = await prisma.post.findMany({
    where: {
      author: {
        username
      }
    },
    include: {
      author: {
        select: { id: true, username: true, name: true, profilePicture: true }
      },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { authorId: req.user?.id }, select: { id: true } }
    }
  });
  return new ApiResponse('Posts retrieved successfully', {
    posts: posts.map(post => ({
      ...post,
      liked: !!post.likes.length,
      likes: undefined
    }))
  }).success(res);
});
