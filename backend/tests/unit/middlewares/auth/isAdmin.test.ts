import { ExpressTypes } from '@/types';
import { isAdmin } from '@/middlewares/auth';

describe('isAdmin', () => {
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

  it('should return 401 if req.user is not present', () => {
    isAdmin(
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

  it('should return 403 if req.user is not admin', () => {
    req.user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'USER',
      isAdmin: false
    };
    isAdmin(
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

  it('should call next if req.user is present, it means user is authenticated', () => {
    req.user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'ADMIN',
      isAdmin: true
    };
    isAdmin(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
  });
});
