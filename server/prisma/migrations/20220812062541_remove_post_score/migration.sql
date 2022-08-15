/*
  Warnings:

  - You are about to drop the column `score` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_serverId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "serverId";
