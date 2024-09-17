import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';

export function isAdmin(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (!req.user)
    return new ApiResponse('Unauthorized', undefined, 401).error(res);
  if (!req.user.isAdmin)
    return new ApiResponse('Forbidden', undefined, 403).error(res);
  return next();
}
