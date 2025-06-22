import { sign, SignOptions, verify } from 'jsonwebtoken';

export function generateToken(data: any, secret: string, expiresIn: string) {
	const options: SignOptions = { expiresIn: expiresIn as `${number}D` };
	return sign(data, secret, options);
}

export function verifyToken(token: string, secret: string) {
	try {
		return verify(token, secret);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return null;
	}
}
