const prismaMock = {
	comment: {
		findMany: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { getCommentsByPostId } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('getCommentsByPostId', () => {
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

	it('should return comments without liked field when user is not logged in', async () => {
		req = {
			params: {
				postId: '1'
			}
		};
		(prismaMock.comment.findMany as jest.Mock).mockResolvedValueOnce([]);
		await getCommentsByPostId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					comments: expect.arrayContaining([])
				}
			})
		);
	});

	it('should return comments with liked field when user is logged in', async () => {
		req = {
			params: {
				postId: '1'
			},
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			}
		};
		(prismaMock.comment.findMany as jest.Mock).mockResolvedValueOnce([
			{
				id: '1',
				content: 'Test comment',
				createdAt: new Date(),
				updatedAt: new Date(),
				author: {
					id: '1',
					username: 'user1',
					name: 'User 1',
					role: 'USER'
				},
				likes: ['1']
			}
		]);
		await getCommentsByPostId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					comments: expect.arrayContaining([
						expect.objectContaining({ liked: true })
					])
				}
			})
		);
	});
});
