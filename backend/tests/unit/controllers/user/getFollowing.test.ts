import { getFollowing } from '@/controllers/user.controller';
import { prisma } from '@/db';
import { ExpressTypes } from '@/types';

jest.mock('@/db', () => ({
  prisma: {
    prismaClient: {
      user: {
        findUnique: jest.fn()
      },
      follow: {
        findMany: jest.fn()
      }
    }
  }
}));

describe('getFollowing', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;
  beforeAll(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if username is not provided', async () => {
    req.params = {};
    await getFollowing(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Username is required'
      })
    );
  });

  it('should return 404 if user is not found', async () => {
    req.params = {
      username: 'nonexistentuser'
    };
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
    await getFollowing(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    // expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User does not exist'
      })
    );
  });
});
