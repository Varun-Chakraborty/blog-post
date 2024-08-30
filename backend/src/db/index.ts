import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

const prismaExt = Prisma.defineExtension({
  model: {
    user: {
      async verifyPassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
      }
    }
  },
  query: {
    user: {
      async create({ args, query }) {
        const { data } = args;
        data.password = await hashPassword(data.password);
        return query(args);
      },
      async update({ args, query }) {
        const { data } = args;
        if (data.password) {
          data.password = await hashPassword(data.password as string);
        }
        return query(args);
      }
    }
  }
});

export const prisma = new PrismaClient().$extends(prismaExt);
