import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';
import { z } from 'zod';

export const isUsernameAvailable = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.query;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  if (username === 'me') {
    return new ApiResponse('Username cannot be "me"', undefined, 400).error(
      res
    );
  }

  if (
    !z
      .string()
      .regex(/^[a-zA-Z0-9]+$/)
      .safeParse(username).success
  ) {
    return new ApiResponse(
      'Username can only contain letters and numbers',
      undefined,
      400
    ).error(res);
  }

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (user)
    return new ApiResponse('Username already exists', undefined, 409).error(
      res
    );
  return new ApiResponse('Username is available').success(res);
});
