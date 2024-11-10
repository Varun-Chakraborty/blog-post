const prismaMock = {
  chat: {
    create: jest.fn(),
    findFirst: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { createChat } from '@/controllers/chat.controller';
import { ExpressTypes } from '@/types';

describe('createChat', () => {
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

  it('should return 400 if participants are not provided', async () => {
    req = {
      body: {
        type: 'CHAT'
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Participants are required'
      })
    );
  });

  it('should return 400 if type is not provided', async () => {
    req = {
      body: {
        participants: ['testUser1', 'testUser2']
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat type is required'
      })
    );
  });

  it('should return 400 if type is invalid', async () => {
    req = {
      body: {
        participants: ['testUser1', 'testUser2'],
        // @ts-ignore
        type: 'INVALID'
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid chat type'
      })
    );
  });

  it('should return 400 if chat type is group and participants are less than 2', async () => {
    req = {
      body: {
        participants: ['testUser1'],
        type: 'GROUP'
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Group must have at least 2 participants'
      })
    );
  });

  it('should return 400 if chat type is group and group name is not provided', async () => {
    req = {
      body: {
        participants: ['testUser1', 'testUser2'],
        type: 'GROUP'
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Group name is required'
      })
    );
  });

  it('should return 400 if chat type is chat and participants are not 2', async () => {
    req = {
      body: {
        participants: ['testUser1'],
        type: 'CHAT'
      }
    };
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat must have exactly 2 participants'
      })
    );
  });

  it('should return 201 if chat is created', async () => {
    req = {
      body: {
        participants: ['testUser1', 'testUser2'],
        type: 'CHAT'
      },
      user: {
        id: 'testUserId',
        username: 'testUser1',
        name: 'testUser1',
        role: 'USER'
      }
    };
    (prismaMock.chat.create as jest.Mock).mockResolvedValue({});
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat created successfully'
      })
    );
  });

  it('should return 201 if group is created', async () => {
    req = {
      body: {
        participants: ['testUser1', 'testUser2'],
        type: 'GROUP',
        groupName: 'testGroup'
      },
      user: {
        id: 'testUserId',
        username: 'testUser1',
        name: 'testUser1',
        role: 'USER'
      }
    };
    (prismaMock.chat.create as jest.Mock).mockResolvedValue({});
    await createChat(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat created successfully'
      })
    );
  });
});
