import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const followUser = wrapperFx(
  async (req: ExpressTypes.Req, res: ExpressTypes.Res) => {
    const { username } = req.body;
    if (!username)
      return new ApiResponse('Username is required', undefined, 400).error(res);
    return new ApiResponse('User followed').success(res);
  }
);

export const unfollowUser = wrapperFx(
  async (req: ExpressTypes.Req, res: ExpressTypes.Res) => {
    const { username } = req.body;
    if (!username)
      return new ApiResponse('Username is required', undefined, 400).error(res);
    return new ApiResponse('User unfollowed').success(res);
  }
);
