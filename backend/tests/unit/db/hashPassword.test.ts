import { hashPassword } from '@/db';

describe('hashPassword', () => {
  it('should hash the password', async () => {
    const password = 'password';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);
  });
});
