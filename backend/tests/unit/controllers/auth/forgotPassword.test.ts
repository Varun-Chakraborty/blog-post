const prismaMock = {
	user: {
		findUnique: jest.fn(),
		update: jest.fn()
	}
};

const emailMock = {
	send: jest.fn()
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock),
}));

jest.mock('@/services', () => ({
	RedisService: jest.fn(() => ({
		getResetRequestCount: jest.fn(),
		setResetToken: jest.fn()
	})),
	getEmailInstance: jest.fn(() => ({
		send: jest.fn()		
	}))
}))

import { forgotPassword } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';

describe('forgotPassword', () => {
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

	it('should return 400 if email is not provided', async () => {
        req.body = {};
		await forgotPassword(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Email is required'
			})
		);
	});

    it('should return 200 if email is provided and generate reset token if user exists', async () => {
        req.body = {
            email: 'email'
        };
        prismaMock.user.findUnique.mockResolvedValue({
            id: '1',
            username: 'testuser',
            name: 'Test User',
            email: 'email',
            role: 'USER'
        })
        await forgotPassword(
            req as ExpressTypes.Req,
            res as ExpressTypes.Res,
            next as ExpressTypes.Next
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Password reset link has been sent to your email'
            })
        );
    });
});
