import {
  AccessJWTPayload,
  AccessJWTResponse,
  RefreshJWTResponse,
} from '@/types';
import { sign, verify } from 'jsonwebtoken';

export function generateToken(data: any, secret: string, expiresIn: string) {
  return sign(data, secret, { expiresIn }) as string;
}

export function verifyToken(token: string, secret: string) {
  try {
    return verify(token, secret) as AccessJWTResponse | RefreshJWTResponse;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

interface data extends AccessJWTPayload {
  password?: string;
  refreshToken?: string;
}

export function sanitizePayload(data: data): AccessJWTPayload {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...rest } = data;
  return rest;
}
