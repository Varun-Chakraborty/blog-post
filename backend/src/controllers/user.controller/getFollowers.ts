import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getFollowers = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  const followers = await prisma.prismaClient.follow.findMany({
    where: {
      following: { username }
    },
    select: {
      follower: { select: { id: true, username: true, profilePicture: true } }
    }
  });
  return new ApiResponse('Followers fetched', { followers }).success(res);
});
