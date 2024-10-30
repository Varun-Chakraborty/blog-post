import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
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

let prismaClient: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prismaClient) {
    const prismaExt = Prisma.defineExtension({
      query: {
        user: {
          create: hashDuringCreate,
          update: hashDuringUpdate
        }
      }
    });
    prismaClient = new PrismaClient().$extends(prismaExt) as PrismaClient;
  }

  return prismaClient;
}
