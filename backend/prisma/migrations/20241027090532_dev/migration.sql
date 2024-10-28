/*
  Warnings:

  - You are about to drop the column `pfp` on the `User` table. All the data in the column will be lost.
  - Added the required column `groupAvatar` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "groupAvatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pfp",
ADD COLUMN     "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "_messagesRead" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_messagesRead_AB_unique" ON "_messagesRead"("A", "B");

-- CreateIndex
CREATE INDEX "_messagesRead_B_index" ON "_messagesRead"("B");

-- AddForeignKey
ALTER TABLE "_messagesRead" ADD CONSTRAINT "_messagesRead_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_messagesRead" ADD CONSTRAINT "_messagesRead_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
