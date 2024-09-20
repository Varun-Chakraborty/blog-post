import { wrapperFx } from '@/utils/wrapperFx';
import { ExpressTypes } from '@/types';

describe('wrapperFx', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call the wrapped function and return the result', async () => {
    const mockFx = jest.fn().mockResolvedValue(res);

    const wrapped = wrapperFx(mockFx);

    await wrapped(req as ExpressTypes.Req, res as ExpressTypes.Res, next);

    expect(mockFx).toHaveBeenCalledWith(req, res, next);
    
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('should handle errors thrown by the wrapped function and call ApiResponse', async () => {
    const error = new Error('Test error');
    const mockFx = jest.fn().mockRejectedValue(error);

    const wrapped = wrapperFx(mockFx);

    await wrapped(req as ExpressTypes.Req, res as ExpressTypes.Res, next);

    expect(mockFx).toHaveBeenCalledWith(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500); // Check if status 500 is set
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Internal server error' })); // Check if json contains error message
  });
});
