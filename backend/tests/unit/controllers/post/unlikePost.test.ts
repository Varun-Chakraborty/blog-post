const prismaMock = {
  post: {
    findUnique: jest.fn()
  },
  like: {
    findFirst: jest.fn(),
    delete: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { unlikePost } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('unlikePost', () => {
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

  it('should return 400 if postId is not provided', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {},
      body: {}
    };
    await unlikePost(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'PostId is required'
      })
    );
  });

  it('should return 404 if post does not exist', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        postId: '1'
      },
      body: {}
    };
    prismaMock.post.findUnique.mockResolvedValue(null);
    await unlikePost(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Post not found'
      })
    );
  });

  it('should return 404 if user has not liked the post', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        postId: '1'
      },
      body: {}
    };
    prismaMock.post.findUnique.mockResolvedValue({
      id: '1',
      userId: '1',
      title: 'Test Post',
      content: 'This is a test post',
      likes: []
    });
    prismaMock.like.findFirst.mockResolvedValue(null);
    await unlikePost(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'You have not liked this post yet'
      })
    );
  });

  it('should unlike the post and return 200', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        postId: '1'
      },
      body: {}
    };
    prismaMock.post.findUnique.mockResolvedValue({
      id: '1',
      userId: '1',
      title: 'Test Post',
      content: 'This is a test post',
      likes: ['1']
    });
    prismaMock.like.findFirst.mockResolvedValue({
      id: '1',
      userId: '1',
      postId: '1'
    });
    prismaMock.like.delete.mockResolvedValue({
      id: '1',
      userId: '1',
      postId: '1'
    });
    await unlikePost(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Post unliked successfully'
      })
    );
  });
});
