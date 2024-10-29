import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const isFollowed = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  const targetUserId = (
    await prisma.prismaClient.user.findUnique({
      where: { username },
      select: { id: true }
    })
  )?.id;

  if (!targetUserId)
    return new ApiResponse('User does not exist', undefined, 404).error(res);

  const isFollowed = await prisma.prismaClient.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: targetUserId,
        followingId: req.user!.id
      }
    }
  });

  if (!isFollowed)
    return new ApiResponse(
      'You are not following this user',
      undefined,
      404
    ).error(res);
  return new ApiResponse('You are following this user').success(res);
});
