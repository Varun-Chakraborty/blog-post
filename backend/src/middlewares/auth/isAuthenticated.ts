import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function isAuthenticated(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next
) {
	if (!req.user) {
		new ApiResponse('Unauthorized', undefined, 401).error(res);
		return;
	}
	return next();
}
