import { prisma, redis } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { setCookie } from '@/utils/setCookie';
import { generateTokens, verifyRefreshTokens } from '@/utils/tokens';
import { wrapperFx } from '@/utils/wrapperFx';

export const refreshToken = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const refreshToken =
    req.cookies.refreshToken ?? req.headers.authorization?.split(' ')[1];

  if (!refreshToken)
    return new ApiResponse('No refresh token found', undefined, 401).error(res);

  const doesExists = await redis.redisClient.exists(refreshToken);
  if (doesExists)
    return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

  const verificationResponse = verifyRefreshTokens(refreshToken);
  if (!verificationResponse)
    return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

  const { id } = verificationResponse;

  const user = await prisma.prismaClient.user.findUnique({
    where: { id },
    omit: { password: true }
  });

  if (!user || user.refreshToken !== refreshToken)
    return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

  const { access } = generateTokens(user, 'access');

  res = setCookie('accessToken', access!, res, {
    maxAge: Number(
      process.env.ACCESS_COOKIE_MAX_AGE || String(1000 * 60 * 60 * 24)
    )
  });

  return new ApiResponse('Refresh successful', { accessToken: access }).success(
    res
  );
});
