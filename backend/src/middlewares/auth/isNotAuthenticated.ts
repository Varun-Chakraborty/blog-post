import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function isNotAuthenticated(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next
) {
	if (req.user) {
		new ApiResponse('Forbidden', undefined, 403).error(res);
		return;
	}
	return next();
}
