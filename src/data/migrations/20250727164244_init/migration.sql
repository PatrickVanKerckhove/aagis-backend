-- CreateTable
CREATE TABLE `markers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siteId` INTEGER UNSIGNED NOT NULL,
    `wendeId` INTEGER UNSIGNED NULL,
    `naam` VARCHAR(255) NOT NULL,
    `beschrijving` TEXT NULL,
    `breedtegraad` DECIMAL(10, 8) NOT NULL,
    `lengtegraad` DECIMAL(11, 8) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `idx_marker_naam_unique`(`naam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wendes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siteId` INTEGER UNSIGNED NOT NULL,
    `wendeType` ENUM('ZOMERZONNEWENDE', 'WINTERZONNEWENDE', 'NOORDGROTEMAANWENDE', 'NOORDKLEINEMAANWENDE', 'ZUIDGROTEMAANWENDE', 'ZUIDKLEINEMAANWENDE') NOT NULL,
    `astronomischEvent` ENUM('ONDERGANG', 'OPGANG') NOT NULL,
    `datumTijd` DATETIME(0) NOT NULL,
    `azimuthoek` DECIMAL(6, 2) NOT NULL,
    `calculatedBy` VARCHAR(255) NOT NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archeosites` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `land` VARCHAR(255) NOT NULL,
    `beschrijving` TEXT NULL,
    `breedtegraad` DECIMAL(10, 8) NOT NULL,
    `lengtegraad` DECIMAL(11, 8) NOT NULL,
    `hoogte` INTEGER NULL,
    `foto` VARCHAR(255) NULL,
    `createdBy` INTEGER UNSIGNED NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `idx_archeosite_naam_unique`(`naam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `roles` JSON NOT NULL,

    UNIQUE INDEX `idx_user_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `markers` ADD CONSTRAINT `fk_marker_site` FOREIGN KEY (`siteId`) REFERENCES `archeosites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `markers` ADD CONSTRAINT `fk_marker_wende` FOREIGN KEY (`wendeId`) REFERENCES `wendes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `markers` ADD CONSTRAINT `markers_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wendes` ADD CONSTRAINT `fk_wende_site` FOREIGN KEY (`siteId`) REFERENCES `archeosites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wendes` ADD CONSTRAINT `wendes_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archeosites` ADD CONSTRAINT `archeosites_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
