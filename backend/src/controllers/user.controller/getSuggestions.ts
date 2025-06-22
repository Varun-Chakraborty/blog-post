import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getSuggestions = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { username } = req.params;
	const { skip, take } = req.query;

	if (!username)
		return new ApiResponse('Username is required', undefined, 400).error(res);

	const prisma = getPrismaClient();
	const users = await prisma.user.findMany({
		where: {
			NOT: {
				username: username
			}
		},
		select: { id: true, username: true, name: true, profilePicture: true },
		take: Number(take ?? 10),
		skip: Number(skip ?? 0)
	});
	return new ApiResponse(
		'Suggestions fetched successfully',
		{ suggestions: users },
		200
	).success(res);
});
