import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function hashDuringCreate({
  args,
  query
}: {
  args: { data: { password: string } };
  query: any;
}) {
  const { data } = args;
  data.password = await hashPassword(data.password);
  return query(args);
}

export async function hashDuringUpdate({
  args,
  query
}: {
  args: Prisma.UserUpdateArgs;
  query: (args: Prisma.UserUpdateArgs) => Prisma.PrismaPromise<any>;
}) {
  const { data } = args;
  if (typeof data.password === 'string' && data.password) {
    data.password = await hashPassword(data.password);
  }
  return query(args);
}

const prismaExt = Prisma.defineExtension({
  model: {
    user: {
      verifyPassword
    }
  },
  query: {
    user: {
      create: hashDuringCreate,
      update: hashDuringUpdate
    }
  }
});

export const prisma = new PrismaClient().$extends(prismaExt);
