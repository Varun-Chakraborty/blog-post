import { getPrismaClient } from '@/db';
import { getEmailInstance, RedisService } from '@/services';
import { ApiResponse, wrapperFx } from '@/utils';

export const forgotPassword = wrapperFx(async function (req, res) {
	const { email } = req.body;

	if (!email)
		return new ApiResponse('Email is required', undefined, 400).error(res);

	const redis = new RedisService();

	if ((await redis.getResetRequestCount(email)) === 3) {
		return new ApiResponse(
			'You have exceeded the maximum number of password reset requests. Please try again later.',
			undefined,
			400
		).error(res);
	}

	const prisma = getPrismaClient();
	const existingUser = await prisma.user.findUnique({
		where: { email }
	});

	if (existingUser) {
		// const resetToken = crypto.randomUUID();
		let resetToken = Math.floor(Math.random() * 999999 + 1)
			.toString()
			.padStart(6, '0');

		if (process.env.NODE_ENV === 'development') {
			console.log(resetToken);
		} else {
			const emailClient = getEmailInstance();
			await emailClient.send(
				email,
				'Password Reset',
				`Hey <b>@${existingUser.username}</b>,<br>here is your password reset token: <b>${resetToken}</b>.<br>Didn't request this? Please ignore. And don't share this token with anyone.`
			);
		}
		redis.setResetToken(email, resetToken);
	}

	return new ApiResponse(
		'Password reset link has been sent to your email',
		undefined,
		200
	).success(res);
});
