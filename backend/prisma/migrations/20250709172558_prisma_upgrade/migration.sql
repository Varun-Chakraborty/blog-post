-- AlterTable
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChatToUser_AB_unique";

-- AlterTable
ALTER TABLE "_messagesRead" ADD CONSTRAINT "_messagesRead_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_messagesRead_AB_unique";
