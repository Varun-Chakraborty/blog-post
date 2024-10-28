import { getChatById } from '@/controllers/chat.controller';
import { ExpressTypes } from '@/types';

describe('getChatById', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeAll(() => {
    req = {
      params: {
        chatId: 'testChatId'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 200', async () => {
    await getChatById(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
