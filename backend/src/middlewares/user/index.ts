import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function handleMeKeyword(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (req.params.username === 'me') {
    if (!req.user) {
      return new ApiResponse(
        'You need to login to access this keyword username',
        undefined,
        401
      ).error(res);
    }
    req.params.username = req.user.username;
  }
  return next();
}
