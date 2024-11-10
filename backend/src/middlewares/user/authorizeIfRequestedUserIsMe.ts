import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function authorizeIfRequestedUserIsMe(
  req: ExpressTypes.Req,
  res: ExpressTypes.Res,
  next: ExpressTypes.Next
) {
  if (!req.user)
    return new ApiResponse('Unauthorized', undefined, 401).error(res);
  if (req.params.username !== req.user.username)
    return new ApiResponse(
      'You can only access such data of yourself',
      undefined,
      403
    ).error(res);
  return next();
}
