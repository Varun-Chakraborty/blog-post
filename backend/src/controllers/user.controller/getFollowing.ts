import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getFollowing = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  const followings = await prisma.prismaClient.follow.findMany({
    where: {
      follower: { username }
    },
    select: {
      following: { select: { id: true, username: true, profilePicture: true } }
    }
  });
  return new ApiResponse('Followings fetched', { followings }).success(res);
});
