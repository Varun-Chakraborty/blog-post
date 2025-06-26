import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function isNotAuthenticated(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next
) {
	if (req.user) {
		new ApiResponse('You are already logged in', { username: req.user.username }, 403).error(res);
		return;
	}
	return next();
}
