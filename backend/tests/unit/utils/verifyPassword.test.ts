import { hashPassword } from '@/db/prisma';
import { verifyPassword } from '@/utils/verifyPassword';

describe('verifyPassword', () => {
  it('should verify the password', async () => {
    const password = 'password';
    const hashedPassword = await hashPassword(password);
    const result = await verifyPassword(password, hashedPassword);
    expect(result).toBe(true);
  });
});
