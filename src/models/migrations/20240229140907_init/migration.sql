/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `user` table. All the data in the column will be lost.
  - Added the required column `city` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "address",
DROP COLUMN "firstName",
DROP COLUMN "secondName",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
