import { ExpressTypes } from '@/types';
import { isAuthenticated } from '@/middlewares/auth';

describe('isNotAuthenticated', () => {
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

  it('should return 401 if req.user is not present, it means user is not authenticated', () => {
    isAuthenticated(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unauthorized'
      })
    );
  });

  it('should call next if req.user is present, it means user is authenticated', () => {
    req.user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'USER'
    };
    isAuthenticated(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
  });
});
