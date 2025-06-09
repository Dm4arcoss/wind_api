-- Create Customer table
CREATE TABLE IF NOT EXISTS `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    INDEX `Customer_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint
ALTER TABLE `Customer` 
ADD CONSTRAINT `Customer_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `User`(`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Add CustomerId column to Order if not exists
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS `customerId` INTEGER NULL;

-- Add foreign key constraint to Order
ALTER TABLE `Order` 
ADD CONSTRAINT IF NOT EXISTS `Order_customerId_fkey` 
FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) 
ON DELETE SET NULL ON UPDATE CASCADE;
