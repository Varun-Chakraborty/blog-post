import { ExpressTypes } from '@/types';
import { ApiResponse } from './ApiResponse';

export function wrapperFx(
  fx: (
    req: ExpressTypes.Req,
    res: ExpressTypes.Res,
    next: ExpressTypes.Next
  ) => Promise<ExpressTypes.Res>
) {
  return async function (
    req: ExpressTypes.Req,
    res: ExpressTypes.Res,
    next: ExpressTypes.Next
  ) {
    try {
      return await fx(req, res, next);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return new ApiResponse(
          error.message,
          undefined,
          500,
          error.stack
        ).error(res);
      } else {
        return new ApiResponse((error as Error).message, undefined, 500).error(
          res
        );
      }
    }
  };
}
