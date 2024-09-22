import { User } from '@/types';
import { sign, verify } from 'jsonwebtoken';

export function generateToken(data: any, secret: string, expiresIn: string) {
  return sign(data, secret, { expiresIn }) as string;
}

export function verifyToken(token: string, secret: string) {
  try {
    return verify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

interface Data extends User {
  password?: string;
  refreshToken?: string;
}

export function sanitizePayload(data: Data): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...rest } = data;
  return rest;
}
