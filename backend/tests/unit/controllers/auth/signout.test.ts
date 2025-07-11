const prismaMock = {
	user: {
		findUnique: jest.fn(() => ({ refreshToken: 'refresh' })),
		update: jest.fn()
	}
};

const redisMock = {
	setDumpedToken: jest.fn()
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

jest.mock('@/services', () => ({
	RedisService: jest.fn(() => redisMock)
}));

jest.mock('@/utils', () => ({
	wrapperFx: jest.requireActual('@/utils').wrapperFx,
	ApiResponse: jest.requireActual('@/utils').ApiResponse,
	tokens: {
		verifyAccessTokens: jest.fn(() => ({ id: '1', exp: 1 })),
		verifyRefreshTokens: jest.fn(() => ({ id: '1', exp: 1 }))
	}
}));

import { signout } from '@/controllers/auth.controller';

import { ExpressTypes } from '@/types';
import { verifyAccessTokens, verifyRefreshTokens } from '@/utils/tokens';

describe('signout', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			clearCookie: jest.fn()
		};
		next = jest.fn();
	});

	it('should verify tokens and return 200', async () => {
		req = {
			user: {
				id: '1',
				name: 'Test User',
				username: 'testuser',
				role: 'USER'
			},
			tokens: {
				accessToken: 'valid'
			}
		};
		(prismaMock.user.update as jest.Mock).mockResolvedValue({
			id: '1',
			name: 'Test User',
			username: 'testuser',
			role: 'USER'
		});
		await signout(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Signout successful'
			})
		);
	});
});
