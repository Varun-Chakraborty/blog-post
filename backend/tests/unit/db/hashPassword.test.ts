import { hashPassword } from '@/db/prisma';

describe('hashPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should hash the password', async () => {
    const password = 'password';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);
  });
});
