const prismaMock = {
	comment: {
		findUnique: jest.fn(),
		create: jest.fn()
	},
	like: {
		findFirst: jest.fn(),
		create: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { replyToComment } from '@/controllers/comment.controller';
import { ExpressTypes } from '@/types';

describe('replyToComment', () => {
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
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			params: {},
			body: {}
		};
		await replyToComment(
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

	it('should return 400 if reply message is not provided', async () => {
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			params: {
				commentId: '1'
			},
			body: {}
		};
		await replyToComment(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Reply message is required'
			})
		);
	});

	it('should return 404 if comment does not exist', async () => {
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			params: {
				commentId: '1'
			},
			body: {
				message: 'Reply message'
			}
		};
		prismaMock.comment.findUnique.mockResolvedValue(null);
		await replyToComment(
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

	it('should reply to the comment and return 201', async () => {
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			params: {
				commentId: '1'
			},
			body: {
				message: 'Reply message'
			}
		};
		prismaMock.comment.findUnique.mockResolvedValue({
			id: '1',
			userId: '1',
			comment: 'This is a comment',
			likes: []
		});
		prismaMock.comment.create.mockResolvedValue({
			id: '2',
			userId: '1',
			comment: 'Reply message',
			likes: [],
			createdAt: new Date(),
			updatedAt: new Date()
		});
		await replyToComment(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					reply: {
						id: '2',
						userId: '1',
						comment: 'Reply message',
						likes: [],
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						_count: {
							likes: 0
						}
					}
				}
			})
		);
	});
});
