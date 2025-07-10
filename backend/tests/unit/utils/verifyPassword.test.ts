import { hashPassword, verifyPassword } from '@/utils/hashes';

describe('verifyPassword', () => {
	it('should verify the password', async () => {
		const password = 'password';
		const hashedPassword = await hashPassword(password);
		const result = await verifyPassword(password, hashedPassword);
		expect(result).toBe(true);
	});
});
