-- AlterTable
ALTER TABLE `Product` ADD COLUMN `price` DECIMAL(65, 30) NULL;

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);
