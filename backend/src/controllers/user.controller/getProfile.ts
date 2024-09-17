import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const getProfile = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const user = req.user;
  return new ApiResponse('Get User', {
    user: { ...user, iat: undefined, exp: undefined }
  }).success(res);
});
