const userList = [
	{
		id: '1',
		username: 'existinguser',
		name: 'Existing User',
		email: 'email',
		role: 'USER'
	}
];

const postList = [
	{
		id: '1',
		title: 'title',
		content: 'content',
		authorId: '1'
	}
];

const prismaMock = {
	user: {
		findMany: jest.fn(() => [userList[0]])
	},
	post: {
		findMany: jest.fn(() => [postList[0]])
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { search } from '@/controllers';

import { ExpressTypes } from '@/types';

describe('search', () => {
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

	it('should return 400 if no query is provided', async () => {
		req.query = {};
		await search(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Search query is required'
			})
		);
	});

	it('should return first 10 of the search results if query is provided', async () => {
		req.query = { query: 'existing' };
		await search(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(prismaMock.user.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				skip: 0,
				take: 10
			})
		);
		expect(prismaMock.post.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				skip: 0,
				take: 10
			})
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					query: 'existing',
					searchResult: {
						users: [userList[0]],
						posts: [postList[0]]
					}
				}
			})
		);
	});

	it('should return first 10 of the search results skipping the count provided in skip', async () => {
		req.query = { query: 'Existing', skip: '2' };
		await search(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(prismaMock.user.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				skip: 2,
				take: 10
			})
		);
		expect(prismaMock.post.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				skip: 2,
				take: 10
			})
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					query: 'existing',
					searchResult: {
						users: [userList[0]],
						posts: [postList[0]]
					}
				}
			})
		);
	});
});
