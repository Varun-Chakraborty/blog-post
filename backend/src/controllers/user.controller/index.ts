import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const isUsernameAvailable = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.query;
  if (!username) return new ApiResponse('Username is required').error(res);
  const user = await prisma.user.findUnique({ where: { username } });
  if (user)
    return new ApiResponse('Username already exists', {}, 409).error(res);
  return new ApiResponse('Username is available', {}, 200).success(res);
});
