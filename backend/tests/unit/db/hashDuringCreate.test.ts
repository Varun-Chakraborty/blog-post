import { hashDuringCreate } from '@/db/prisma';

describe('hashDuringCreate', () => {
	it('should return query with hashed password', async () => {
		const query = jest.fn();
		const password = 'password';
		const isBcryptHash = (hash: string) =>
			/^(\$2[aby]?\$\d{2}\$[a-zA-Z0-9./]{53})$/.test(hash);

		const args = {
			data: {
				password
			}
		};

		await hashDuringCreate({ args, query });

		expect(query).toHaveBeenCalledWith({
			data: {
				password: expect.any(String) // Check if it's a string
			}
		});

		const callArgs = query.mock.calls[0][0];
		expect(callArgs.data.password).not.toBe(password);
		expect(isBcryptHash(callArgs.data.password)).toBe(true);
	});
});
