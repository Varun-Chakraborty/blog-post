import { getPrismaClient, getRedisClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx, setCookie, tokens } from '@/utils';

export const refreshToken = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const refreshToken =
		req.cookies.refreshToken ?? req.headers.authorization?.split(' ')[1];

	if (!refreshToken)
		return new ApiResponse('No refresh token found', undefined, 401).error(res);

	const redis = getRedisClient();
	const prisma = getPrismaClient();

	const doesExists = await redis.exists(refreshToken);
	if (doesExists)
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

	const verificationResponse = tokens.verifyRefreshTokens(refreshToken);
	if (!verificationResponse)
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

	const { id } = verificationResponse;

	const user = await prisma.user.findUnique({
		where: { id },
		omit: { password: true }
	});

	if (!user || user.refreshToken !== refreshToken)
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

	const { access } = tokens.generateTokens(user, 'access');

	res = setCookie('accessToken', access!, res, {
		maxAge: Number(
			process.env.ACCESS_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24)
		)
	});

	return new ApiResponse('Refresh successful', { accessToken: access }).success(
		res
	);
});
