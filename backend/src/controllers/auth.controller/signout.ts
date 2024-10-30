import { getPrismaClient, getRedisClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx, tokens } from '@/utils';

export const signout = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const user = req.user!;

  const redis = getRedisClient();
  const prisma = getPrismaClient();

  // tokens
  const accessToken = req.tokens!.accessToken!;
  const refreshToken = (await prisma.user.findUnique({
    where: { id: user.id },
    select: { refreshToken: true }
  }))!.refreshToken!;

  const accessTokenExpiry = tokens.verifyAccessTokens(accessToken)?.exp;
  const refreshTokenExpiry = tokens.verifyRefreshTokens(refreshToken)?.exp;

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null }
  });

  if (accessTokenExpiry) {
    await redis.set(`token:${accessToken}`, '');
    await redis.expireat(`token:${accessToken}`, accessTokenExpiry);
  }

  if (refreshTokenExpiry) {
    await redis.set(`token:${refreshToken}`, '');
    await redis.expireat(`token:${refreshToken}`, refreshTokenExpiry);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  return new ApiResponse('Signout successful').success(res);
});
