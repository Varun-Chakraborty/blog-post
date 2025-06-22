const prismaMock = {
	comment: {
		findUnique: jest.fn(),
		findMany: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { getRepliesByCommentId } from '@/controllers/comment.controller';
import { ExpressTypes } from '@/types';

describe('getRepliesByCommentId', () => {
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

	it('should return 400 if commentId is not provided', async () => {
		req.params = {};
		await getRepliesByCommentId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'CommentId is required'
			})
		);
	});

	it('should return 404 if comment does not exist', async () => {
		req.params = {
			commentId: '1'
		};
		prismaMock.comment.findMany.mockResolvedValue([]);
		await getRepliesByCommentId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Comment does not exist'
			})
		);
	});

	it('should return replies if comment exists without liked field if user is not logged in', async () => {
		req.params = {
			commentId: '1'
		};
		prismaMock.comment.findUnique.mockResolvedValue({
			id: '1',
			content: 'Comment 1',
			createdAt: new Date(),
			author: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			}
		});
		prismaMock.comment.findMany.mockResolvedValue([]);
		await getRepliesByCommentId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Replies retrieved successfully',
				data: {
					replies: expect.arrayContaining([])
				}
			})
		);
	});

	it('should return replies if comment exists with liked field if user is logged in', async () => {
		req = {
			params: {
				commentId: '1'
			},
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			}
		};
		prismaMock.comment.findUnique.mockResolvedValue({
			id: '1',
			content: 'Comment 1',
			createdAt: new Date(),
			author: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			likes: ['1']
		});
		prismaMock.comment.findMany.mockResolvedValue([
			{
				id: '1',
				content: 'Comment 1',
				createdAt: new Date(),
				author: {
					id: '1',
					username: 'user1',
					name: 'User 1',
					role: 'USER'
				},
				likes: ['1']
			}
		]);
		await getRepliesByCommentId(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Replies retrieved successfully',
				data: {
					replies: expect.arrayContaining([
						expect.objectContaining({
							liked: true
						})
					])
				}
			})
		);
	});
});
