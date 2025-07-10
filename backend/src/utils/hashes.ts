import bcrypt from 'bcrypt';
import sha256 from 'sha256';

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return await bcrypt.compare(password, hashedPassword);
}

export async function hashToken(token: string) {
	return sha256(token);
}

export async function verifyToken(token: string, hashedToken: string) {
	return sha256(token) === hashedToken;
}
