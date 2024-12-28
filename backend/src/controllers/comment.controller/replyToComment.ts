import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const replyToComment = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { commentId } = req.params;
  const { message } = req.body;

  if (!commentId)
    return new ApiResponse('CommentId is required', undefined, 400).error(res);

  if (!message)
    return new ApiResponse('Reply message is required', undefined, 400).error(
      res
    );

  const prisma = getPrismaClient();

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  });

  if (!comment)
    return new ApiResponse('Comment does not exist', undefined, 404).error(res);

  const reply = await prisma.comment.create({
    data: {
      content: message,
      authorId: req.user!.id,
      parentId: commentId
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          profilePicture: true
        }
      }
    }
  });

  return new ApiResponse(
    'Reply created successfully',
    {
      reply: { ...reply, _count: { likes: 0 } }
    },
    201
  ).success(res);
});
