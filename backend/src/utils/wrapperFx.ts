import { ExpressTypes } from '@/types';
import { ApiResponse } from './ApiResponse';

export function wrapperFx(
  fx: (req: ExpressTypes.Req, res: ExpressTypes.Res, next: ExpressTypes.Next) => Promise<ExpressTypes.Res>
) {
  return async function (req: ExpressTypes.Req, res: ExpressTypes.Res, next: ExpressTypes.Next) {
    try {
      return await fx(req, res, next);
    } catch (error) {
      console.error(error);
      return new ApiResponse((error as Error).message, error).error(res);
    }
  };
}
