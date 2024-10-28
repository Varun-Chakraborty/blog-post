/*
  Warnings:

  - The values [PRIVATE] on the enum `ChatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChatType_new" AS ENUM ('GROUP', 'CHAT');
ALTER TABLE "Chat" ALTER COLUMN "type" TYPE "ChatType_new" USING ("type"::text::"ChatType_new");
ALTER TYPE "ChatType" RENAME TO "ChatType_old";
ALTER TYPE "ChatType_new" RENAME TO "ChatType";
DROP TYPE "ChatType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "groupAvatar" DROP NOT NULL;
