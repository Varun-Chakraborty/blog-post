const prismaMock = {
	comment: {
		findUnique: jest.fn(),
		delete: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { deleteComment } from '@/controllers/comment.controller';
import { ExpressTypes } from '@/types';

describe('deleteComment', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
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
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 404 if comment does not exist', async () => {
		prismaMock.comment.findUnique.mockResolvedValue(null);
		await deleteComment(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Comment not found'
			})
		);
	});

	it('should return 403 if user is not the author of the comment', async () => {
		prismaMock.comment.findUnique.mockResolvedValue({ id: '1', authorId: '2' });
		await deleteComment(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'You are not authorized to delete this comment'
			})
		);
	});

	it('should delete the comment', async () => {
		prismaMock.comment.findUnique.mockResolvedValue({ id: '1', authorId: '1' });
		prismaMock.comment.delete.mockResolvedValue({ id: '1' });
		await deleteComment(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Comment deleted successfully'
			})
		);
	});
});
