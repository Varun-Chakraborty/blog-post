import { Res } from '@/types/express';
import { CookieOptions } from 'express';

export function setCookie(
  name: string,
  value: string,
  res: Res,
  options?: CookieOptions
) {
  const defaultCookieOptions: CookieOptions = {
    path: '/',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  };

  res.cookie(name, value, { ...defaultCookieOptions, ...options });

  return res;
}
