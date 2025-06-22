const prismaMock = {
	post: {
		findMany: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { getPosts } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('getPosts', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return posts with liked field', async () => {
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			}
		};
		(prismaMock.post.findMany as jest.Mock).mockResolvedValueOnce([
			{
				id: '1',
				title: 'title',
				content: 'content',
				authorId: '1',
				likes: ['1']
			}
		]);
		await getPosts(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					posts: expect.arrayContaining([
						expect.objectContaining({
							liked: true
						})
					])
				}
			})
		);
	});
});
