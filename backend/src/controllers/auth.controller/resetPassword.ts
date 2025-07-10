import { getPrismaClient } from '@/db';
import { RedisService } from '@/services';
import { ApiResponse, wrapperFx } from '@/utils';

export const resetPassword = wrapperFx(async function (req, res) {
	const { email, resetToken, password } = req.body;

	if (!email || !resetToken || !password) {
		return new ApiResponse(
			'Missing required fields, please provide email, reset token and password',
			undefined,
			400
		).error(res);
	}

	const redis = new RedisService();

	if ((await redis.getResetRetriesCount(email)) === 3) {
		await redis.deleteResetToken(email);
		return new ApiResponse(
			'You have exceeded the maximum number of password reset retries. Request a new token.',
			undefined,
			400
		).error(res);
	}

	const token = await redis.getResetToken(email);

	if (token !== resetToken) {
		return new ApiResponse('Invalid reset token', undefined, 400).error(res);
	}

	const prisma = getPrismaClient();

	await prisma.user.update({
		where: { email },
		data: { password }
	});

	await redis.deleteResetToken(email);
	await redis.deleteResetRetriesCount(email);

	return new ApiResponse(
		'Password reset successfully',
		{ message: 'Password reset successfully' },
		200
	).success(res);
});
