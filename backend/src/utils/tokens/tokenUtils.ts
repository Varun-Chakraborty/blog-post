import { Profile } from '@/types';
import { sign, verify } from 'jsonwebtoken';

export function generateToken(data: any, secret: string, expiresIn: string) {
  return sign(data, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string) {
  try {
    return verify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export function sanitizePayload(data: Profile): Profile {
  const sanitizedPayload: Profile = {
    id: data.id,
    name: data.name,
    username: data.username,
    role: data.role
  };
  return sanitizedPayload;
}
