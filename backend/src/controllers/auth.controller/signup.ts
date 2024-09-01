import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';
import { generateTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';
import { z } from 'zod';

export const signup = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  let { username, name, email, password } = req.body;
  username = username.trim().toLowerCase();
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (!username || !name || !email || !password) {
    return new ApiResponse(
      'Missing required fields, please provide username, email and password',
      undefined,
      400
    ).error(res);
  }

  if (
    !z
      .string()
      .regex(/[a-zA-Z0-9]+$/)
      .safeParse(username).success
  ) {
    return new ApiResponse(
      'Username can only contain letters and numbers',
      undefined,
      400
    ).error(res);
  }

  if (await prisma.user.findUnique({ where: { username } })) {
    return new ApiResponse('Username already exists', undefined, 409).error(
      res
    );
  }

  if (email && (await prisma.user.findUnique({ where: { email } }))) {
    return new ApiResponse('Email already exists', undefined, 409).error(res);
  }

  const user = await prisma.user.create({
    data: { username, name, email, password }
  });

  const { access, refresh } = generateTokens(
    { ...user, password: undefined, refreshToken: undefined },
    'both'
  );

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

  return new ApiResponse(
    'Signup successful',
    { user: { ...user, password: undefined, refreshToken: undefined } },
    201
  ).success(res);
});
