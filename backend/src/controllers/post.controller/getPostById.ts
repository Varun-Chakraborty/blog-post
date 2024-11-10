import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getPostById = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { postId } = req.params;

  if (!postId)
    return new ApiResponse('PostId is required', undefined, 400).error(res);

  const prisma = getPrismaClient();
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          profilePicture: true,
          createdAt: true
        }
      },
      _count: { select: { comments: true, likes: true } },
      likes: { where: { authorId: req.user?.id }, select: { id: true } }
    }
  });

  if (!post)
    return new ApiResponse('Post does not exist', undefined, 404).error(res);

  return new ApiResponse('Post retrieved successfully', {
    post: { ...post, liked: !!post.likes.length, likes: undefined }
  }).success(res);
});
