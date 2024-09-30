import { prisma } from '@/db';
import { verifyPassword } from '@/utils/verifyPassword';

describe('verifyPassword', () => {
  it('should verify the password', async () => {
    const password = 'password';
    const hashedPassword = await prisma.hashPassword(password);
    const result = await verifyPassword(password, hashedPassword);
    expect(result).toBe(true);
  });
});
