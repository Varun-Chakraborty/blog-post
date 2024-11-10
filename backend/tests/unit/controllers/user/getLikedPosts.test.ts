const prismaMock = {
  post: {
    findMany: jest.fn()
  },
  user: {
    findUnique: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getLikedPosts } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getLikedPosts', () => {
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

  it('should return 400 if username is not provided', async () => {
    req.params = {};
    await getLikedPosts(
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
    req = { params: { username: 'user1' } };
    prismaMock.user.findUnique.mockResolvedValue(null);
    await getLikedPosts(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not found'
      })
    );
  });

  it('should return liked posts with liked field set to true', async () => {
    req = {
      params: { username: 'user1' },
      user: { id: '1', username: 'user1', name: 'User 1', role: 'USER' }
    };
    prismaMock.user.findUnique.mockResolvedValue({ id: '1' });
    prismaMock.post.findMany.mockResolvedValue([
      {
        id: '1',
        userId: '1',
        title: 'Test Post',
        content: 'This is a test post'
      }
    ]);
    await getLikedPosts(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Posts retrieved successfully',
        data: {
          posts: expect.arrayContaining([
            expect.objectContaining({
              liked: true
            })
          ])
        }
      })
    );
  });
});
