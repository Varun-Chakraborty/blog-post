import { hashDuringUpdate } from '@/db/prisma';

describe('hashDuringUpdate', () => {
  it('should return query with hashed password', async () => {
    const query = jest.fn();
    const password = 'password';
    const isBcryptHash = (hash: string) =>
      /^(\$2[aby]?\$\d{2}\$[a-zA-Z0-9./]{53})$/.test(hash);

    const args = {
      where: { id: '1' },
      data: {
        password
      }
    };

    await hashDuringUpdate({ args, query });

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          password: expect.any(String)
        }
      })
    );

    const callArgs = query.mock.calls[0][0];
    expect(callArgs.data.password).not.toBe(password);
    expect(isBcryptHash(callArgs.data.password)).toBe(true);
  });
});
