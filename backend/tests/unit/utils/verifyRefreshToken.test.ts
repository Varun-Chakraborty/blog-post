jest.mock('@/utils/tokens/tokenUtils', () => ({
	verifyToken: jest.fn()
}));

import { verifyRefreshTokens } from '@/utils/tokens';
import { verifyToken } from '@/utils/tokens/tokenUtils';

describe('verifyRefreshTokens', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(verifyToken as jest.Mock).mockImplementation((token: string) => {
			if (token === 'valid') return { id: '1' };
			else return null;
		});
	});

	it('should not verify refresh token if invalid', () => {
		const result = verifyRefreshTokens('invalid');
		expect(result).toBe(null);
	});

	it('should verify refresh token if valid', () => {
		const result = verifyRefreshTokens('valid');
		expect(result).toHaveProperty('id');
	});
});
