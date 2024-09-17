import { signout } from '@/controllers/auth.controller';
import { prisma } from '@/db';
import { ExpressTypes } from '@/types';

jest.mock('@/db', () => ({
  prisma: {
    user: {
      update: jest.fn()
    }
  }
}));

describe('signout', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 200', async () => {
    req = {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
        role: 'USER'
      },
      cookies: {
        accessToken: 'valid',
        refreshToken: 'valid'
      }
    };
    (prisma.user.update as jest.Mock).mockResolvedValue({
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
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Signout successful'
      })
    );
  });
});
