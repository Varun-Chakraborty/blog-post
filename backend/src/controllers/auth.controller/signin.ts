import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';
import { generateTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';
import { verifyPassword } from '@/utils/verifyPassword';

export const signin = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username, password } = req.body;

  if (!username || !password) {
    return new ApiResponse(
      'Missing required fields, please provide username and password',
      undefined,
      400
    ).error(res);
  }

  const user = await prisma.prismaClient.user.findUnique({
    where: { username },
    omit: { refreshToken: true }
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return new ApiResponse('Invalid credentials', undefined, 401).error(res);
  }

  const { access, refresh } = generateTokens(user, 'both');

  res = setCookie('accessToken', access!, res, {
    maxAge: Number(
      process.env.ACCESS_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24)
    )
  });
  res = setCookie('refreshToken', refresh!, res, {
    maxAge: Number(
      process.env.REFRESH_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24 * 7)
    ),
    path: '/api/v1/auth/refresh'
  });

  const updatedUser = await prisma.prismaClient.user.update({
    where: { id: user.id },
    data: { refreshToken: refresh },
    omit: { password: true, refreshToken: true }
  });

  return new ApiResponse('Signin successful', {
    user: updatedUser,
    accessToken: access
  }).success(res);
});
