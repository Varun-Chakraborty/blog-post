import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getSuggestions = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { skip, take } = req.query;
	const username = req.user?.username;
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
