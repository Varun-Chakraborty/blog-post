import { prisma, redis } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { verifyAccessTokens, verifyRefreshTokens } from '@/utils/tokens';
import { wrapperFx } from '@/utils/wrapperFx';

export const signout = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const user = req.user!;

  // tokens
  const accessToken = req.tokens!.accessToken!;
  const refreshToken = (await prisma.prismaClient.user.findUnique({
    where: { id: user.id },
    select: { refreshToken: true }
  }))!.refreshToken!;

  const accessTokenExpiry = verifyAccessTokens(accessToken)?.exp;
  const refreshTokenExpiry = verifyRefreshTokens(refreshToken)?.exp;

  await prisma.prismaClient.user.update({
    where: { id: user.id },
    data: { refreshToken: null }
  });

  if (accessTokenExpiry) {
    await redis.redisClient.set(`token:${accessToken}`, '');
    await redis.redisClient.expireat(`token:${accessToken}`, accessTokenExpiry);
  }

  if (refreshTokenExpiry) {
    await redis.redisClient.set(`token:${refreshToken}`, '');
    await redis.redisClient.expireat(
      `token:${refreshToken}`,
      refreshTokenExpiry
    );
  }

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  return new ApiResponse('Signout successful').success(res);
});
