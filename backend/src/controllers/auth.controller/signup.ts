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

  username = username?.trim().toLowerCase();
  name = name?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!username || !name || !email || !password) {
    return new ApiResponse(
      'Missing required fields, please provide username, name, email and password',
      undefined,
      400
    ).error(res);
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

  if (await prisma.prismaClient.user.findUnique({ where: { username } })) {
    return new ApiResponse('Username already exists', undefined, 409).error(
      res
    );
  }

  if (
    email &&
    (await prisma.prismaClient.user.findUnique({ where: { email } }))
  ) {
    return new ApiResponse('Email already exists', undefined, 409).error(res);
  }

  const user = await prisma.prismaClient.user.create({
    data: { username, name, email, password },
    omit: { password: true, refreshToken: true }
  });

  const { access, refresh } = generateTokens(user, 'both');

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

  const updatedUser = await prisma.prismaClient.user.update({
    where: { id: user.id },
    data: { refreshToken: refresh },
    omit: { password: true, refreshToken: true }
  });

  return new ApiResponse(
    'Signup successful',
    { user: updatedUser, accessToken: access },
    201
  ).success(res);
});
