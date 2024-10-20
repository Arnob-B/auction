/*
  Warnings:

  - You are about to drop the column `isListed` on the `Player` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "playerState" AS ENUM ('NOTLISTED', 'LISTED', 'SOLD');

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "isListed",
ADD COLUMN     "state" "playerState" NOT NULL DEFAULT 'NOTLISTED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;
