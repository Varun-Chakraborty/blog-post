import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const followUser = wrapperFx(
  async (req: ExpressTypes.Req, res: ExpressTypes.Res) => {
    const { username } = req.params;

    if (!username)
      return new ApiResponse('Username is required', undefined, 400).error(res);

    const prisma = getPrismaClient();

    const targetUserId = (
      await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      })
    )?.id;

    if (!targetUserId)
      return new ApiResponse('User does not exist', undefined, 404).error(res);

    console.log(req.user!.id, targetUserId);

    await prisma.follow.create({
      data: {
        followerId: req.user!.id,
        followingId: targetUserId
      }
    });

    return new ApiResponse('User followed', undefined, 201).success(res);
  }
);
