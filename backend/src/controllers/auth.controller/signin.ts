import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';
import { generateTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';

export const signin = wrapperFx(async function (
    req: ExpressTypes.Req,
    res: ExpressTypes.Res
  ) {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
  
    if (!user || !(await prisma.user.verifyPassword(password, user.password))) {
      return new ApiResponse('Invalid credentials', {}, 401).error(res);
    }
  
    const { access, refresh } = generateTokens({...user, password: undefined}, 'both');
  
    res = setCookie('accessToken', access!, res, {
      maxAge: Number(
        process.env.ACCESS_COOKIE_MAX_AGE || String(1000 * 60 * 60 * 24)
      )
    });
    res = setCookie('refreshToken', refresh!, res, {
      maxAge: Number(
        process.env.REFRESH_COOKIE_MAX_AGE || String(1000 * 60 * 60 * 24 * 7)
      ),
      path: '/api/v1/auth/refresh'
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh }
    });
  
    return new ApiResponse('Signin successful', {
      user: { ...user, password: undefined },
      accessToken: access
    }).success(res);
  });