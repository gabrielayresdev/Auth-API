-- DropIndex
DROP INDEX "user_secondName_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "secondName" SET DATA TYPE TEXT;
