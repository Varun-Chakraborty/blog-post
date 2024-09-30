import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function hashDuringCreate({
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

async function hashDuringUpdate({
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

namespace global {
  export let prismaClient: Omit<PrismaClient, '$on' | '$use'>;
}

if (!global.prismaClient) {
  const prismaExt = Prisma.defineExtension({
    query: {
      user: {
        create: hashDuringCreate,
        update: hashDuringUpdate
      }
    }
  });
  global.prismaClient = new PrismaClient().$extends(prismaExt) as Omit<
    PrismaClient,
    '$on' | '$use'
  >;
}
const prismaClient = global.prismaClient;

export default {
  hashPassword,
  hashDuringCreate,
  hashDuringUpdate,
  prismaClient
};
