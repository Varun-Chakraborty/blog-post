jest.mock('@/utils/tokens/tokenUtils', () => ({
  generateToken: jest.fn(),
  sanitizePayload: jest.requireActual('@/utils/tokens/tokenUtils')
    .sanitizePayload
}));

import { generateTokens } from '@/utils/tokens';
import { generateToken } from '@/utils/tokens/tokenUtils';
import { UserWithCredentials } from '@/types';

describe('generateTokens', () => {
  let payload: UserWithCredentials;
  beforeEach(() => {
    payload = {
      id: '1',
      username: 'test',
      name: 'Test User',
      role: 'USER',
      password: 'testpassword'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate access and refresh tokens', () => {
    (generateToken as jest.Mock).mockReturnValueOnce('accessToken');
    (generateToken as jest.Mock).mockReturnValueOnce('refreshToken');

    const tokens = generateTokens(payload, 'both');

    expect(generateToken).toHaveBeenCalledTimes(2);
    expect(generateToken).toHaveBeenNthCalledWith(
      1,
      expect.not.objectContaining({ password: expect.any(String) }),
      undefined,
      expect.any(String)
    );
    expect(generateToken).toHaveBeenNthCalledWith(
      2,
      { id: payload.id },
      undefined,
      expect.any(String)
    );

    expect(tokens).toHaveProperty('access', 'accessToken');
    expect(tokens).toHaveProperty('refresh', 'refreshToken');
  });

  it('should generate only an access token', () => {
    (generateToken as jest.Mock).mockReturnValueOnce('accessToken');
    const tokens = generateTokens(payload, 'access');

    expect(generateToken).toHaveBeenCalledWith(
      expect.not.objectContaining({ password: expect.any(String) }),
      undefined,
      expect.any(String)
    );

    expect(tokens).toHaveProperty('access', 'accessToken');
    expect(tokens).not.toHaveProperty('refresh');
  });

  it('should generate only a refresh token', () => {
    (generateToken as jest.Mock).mockReturnValueOnce('refreshToken');
    const tokens = generateTokens(payload, 'refresh');

    expect(generateToken).toHaveBeenCalledWith(
      { id: payload.id },
      undefined,
      expect.any(String)
    );

    expect(tokens).toHaveProperty('refresh', 'refreshToken');
    expect(tokens).not.toHaveProperty('access');
  });
});
