import { RedisService } from '@/services';
import { ExpressTypes } from '@/types';
import { verifyAccessTokens } from '@/utils/tokens';

export async function authenticate(
	req: ExpressTypes.Req,
	_: ExpressTypes.Res,
	next: ExpressTypes.Next
) {
	const token =
		req.cookies.accessToken ?? req.headers.authorization?.split(' ')[1];

	if (!token) return next();

	const redis = new RedisService();

	const doesTokenExistOnRedis = await redis.isTheTokenDumped(token);
	if (doesTokenExistOnRedis) return next();

	const user = verifyAccessTokens(token);

	if (!user) return next();

	req.user = user;
	req.user.isAdmin = user.role === 'ADMIN';
	req.tokens = { accessToken: token };
	return next();
}
