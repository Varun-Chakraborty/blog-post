import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { verifyTokens } from '@/utils/tokens';

export async function authenticate(
  req: ExpressTypes.Req,
  _: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  const token = req.headers.authorization || req.cookies.accessToken;
  if (!token) return next();

  // TODO: need to implement redis for this
  // if (await prisma.dumpedToken.findUnique({ where: { token } })) {
  //   return next();
  // }

  const user = verifyTokens(token, 'access');
  if (!user) return next();

  req.user = user as any;
  return next();
}

export function isAuthenticated(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (!req.user)
    return new ApiResponse('Unauthorized', undefined, 401).error(res);
  return next();
}

export function isAdmin(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (!req.user)
    return new ApiResponse('Unauthorized', undefined, 401).error(res);
  if (req.user.role !== 'ADMIN')
    return new ApiResponse('Unauthorized', undefined, 401).error(res);
  return next();
}

export function isNoAuth(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (req.user) return new ApiResponse('Forbidden', undefined, 403).error(res);
  return next();
}
