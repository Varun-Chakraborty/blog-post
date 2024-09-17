import { ExpressTypes } from '@/types';
import { verifyAccessTokens } from '@/utils/tokens';

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
  
    const user = verifyAccessTokens(token);
    if (!user) return next();
  
    req.user = user;
    req.user.isAdmin = user.role === 'ADMIN';
    return next();
  }