import { getPrismaClient } from '@/db';
import { RedisService } from '@/services';
import { ApiResponse, wrapperFx } from '@/utils';

const verifyEmail = wrapperFx(async function (req, res) {
	const { email } = req.body;

	if (!email) {
		return new ApiResponse('Email is required', undefined, 400).error(res);
	}

	const redis = new RedisService();
	if ((await redis.getVerificationRequestCount(email)) === 1) {
		return new ApiResponse(
			'You have exceeded the maximum number of email verification requests. Please try again later.',
			undefined,
			400
		).error(res);
	}

	const prisma = getPrismaClient();
	const existingUser = await prisma.user.findUnique({
		where: { email }
	});

	if (!existingUser) {
		return new ApiResponse('User not found', undefined, 404).error(res);
	}

	return new ApiResponse('Email verified', { email }, 200).success(res);
});
