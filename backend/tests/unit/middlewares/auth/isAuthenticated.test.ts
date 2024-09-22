import { ExpressTypes } from '@/types';
import { isNotAuthenticated } from '@/middlewares/auth';

describe('isAuthenticated', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 403 if req.user is present', () => {
    req.user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'USER'
    };
    isNotAuthenticated(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Forbidden'
      })
    );
  });

  it('should call next if req.user is not present', () => {
    isNotAuthenticated(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
  });
});
