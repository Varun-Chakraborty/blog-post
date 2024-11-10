const prismaMock = {
  comment: {
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

import { unlikeComment } from '@/controllers/comment.controller';
import { ExpressTypes } from '@/types';

describe('unlikeComment', () => {
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

  it('should return 400 if commentId is not provided', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        commentId: ''
      }
    };
    await unlikeComment(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'CommentId is required'
      })
    );
  });

  it('should return 404 if comment does not exist', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        commentId: '1'
      }
    };
    prismaMock.comment.findUnique.mockResolvedValue(null);
    await unlikeComment(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Comment not found'
      })
    );
  });

  it('should return 404 if user has not liked the comment', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        commentId: '1'
      }
    };
    prismaMock.comment.findUnique.mockResolvedValue({
      id: '1',
      userId: '1',
      comment: 'This is a comment',
      likes: []
    });
    prismaMock.like.findFirst.mockResolvedValue(null);
    await unlikeComment(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'You have not liked this comment yet'
      })
    );
  });

  it('should unlike the comment and return 200', async () => {
    req = {
      user: {
        id: '1',
        username: 'user1',
        name: 'User 1',
        role: 'USER'
      },
      params: {
        commentId: '1'
      }
    };
    prismaMock.comment.findUnique.mockResolvedValue({
      id: '1',
      userId: '1',
      comment: 'This is a comment',
      likes: [
        {
          userId: '1'
        }
      ]
    });
    prismaMock.like.findFirst.mockResolvedValue({
      id: '1',
      userId: '1',
      commentId: '1'
    });
    await unlikeComment(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Comment unliked successfully'
      })
    );
  });
});
