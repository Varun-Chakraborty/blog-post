import { resolveUsernameMeKeyword } from '@/middlewares/user';
import { ExpressTypes } from '@/types';

describe('describeMeKeyword', () => {
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

  it('should directly call next if username in params does not contain "me"', () => {
    req.params = {
      username: 'testUsername'
    };
    resolveUsernameMeKeyword(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if username in params contains "me" but user is not authenticated', () => {
    req = {
      params: {
        username: 'me'
      },
      user: undefined
    };
    resolveUsernameMeKeyword(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'You need to login to access this keyword username'
      })
    );
  });

  it('should replace username in params with user.username if username in params contains "me" and user is authenticated', () => {
    req = {
      params: {
        username: 'me'
      },
      user: {
        id: '1',
        username: 'testUsername',
        name: 'Test User',
        role: 'USER'
      }
    };
    resolveUsernameMeKeyword(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(req.params!.username).toBe('testUsername');
  });
});
