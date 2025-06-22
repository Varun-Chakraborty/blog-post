const prismaMock = {
	post: {
		create: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { createPost } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('createPost', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			body: {}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 400 if title or content is not provided', async () => {
		await createPost(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Title and content are required' })
		);
	});

	it('should create post and return 201', async () => {
		req.body = {
			title: 'Test Post',
			content: 'This is a test post'
		};
		prismaMock.post.create.mockResolvedValue({ id: '1' });
		await createPost(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Post created successfully' })
		);
	});
});
