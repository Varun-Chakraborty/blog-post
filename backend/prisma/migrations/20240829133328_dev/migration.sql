/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `DumpedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DumpedToken_token_key" ON "DumpedToken"("token");
