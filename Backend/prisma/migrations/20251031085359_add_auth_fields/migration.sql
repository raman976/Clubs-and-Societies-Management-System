/*
  Warnings:

  - You are about to alter the column `role` on the `CoreMember` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `CoreMember` ADD COLUMN `refreshTokenHash` VARCHAR(191) NULL,
    MODIFY `role` ENUM('MEMBER', 'PRESIDENT', 'VICE_PRESIDENT', 'HANDLER', 'SUPER_ADMIN') NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE `User`;
