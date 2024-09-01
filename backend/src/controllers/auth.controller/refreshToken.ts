import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { setCookie } from '@/utils/setCookie';
import { generateTokens, verifyTokens } from '@/utils/tokens';
import { wrapperFx } from '@/utils/wrapperFx';

export const refreshToken = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return new ApiResponse('No refresh token found', undefined, 401).error(res);

  const { id } = verifyTokens(refreshToken, 'refresh')!;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.refreshToken !== refreshToken)
    return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

  const { access } = generateTokens(
    { ...user, password: undefined, refreshToken: undefined },
    'access'
  );

  res = setCookie('accessToken', access!, res, {
    maxAge: Number(
      process.env.ACCESS_COOKIE_MAX_AGE || String(1000 * 60 * 60 * 24)
    )
  });

  return new ApiResponse('Refresh successful', { accessToken: access }).success(
    res
  );
});
