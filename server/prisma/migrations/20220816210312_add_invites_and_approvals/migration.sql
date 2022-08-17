/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ServerMembership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invitationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ServerMembership" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitationId" UUID;

-- CreateTable
CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "serverId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "inviteUserDisplayName" TEXT NOT NULL,
    "socialProofLink" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" UUID NOT NULL,
    "invitationId" UUID NOT NULL,
    "serverId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_inviteUserDisplayName_key" ON "Invitation"("inviteUserDisplayName");

-- CreateIndex
CREATE UNIQUE INDEX "User_invitationId_key" ON "User"("invitationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
