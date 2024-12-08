-- CreateTable
CREATE TABLE `markers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siteId` INTEGER UNSIGNED NOT NULL,
    `wendeId` INTEGER UNSIGNED NULL,
    `naam` VARCHAR(255) NOT NULL,
    `beschrijving` TEXT NULL,
    `breedtegraad` DECIMAL(10, 8) NOT NULL,
    `lengtegraad` DECIMAL(11, 8) NOT NULL,
    `foto` VARCHAR(255) NULL,

    UNIQUE INDEX `idx_marker_naam_unique`(`naam`),
    UNIQUE INDEX `idx_marker_foto_unique`(`foto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wendes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siteId` INTEGER UNSIGNED NOT NULL,
    `wendeType` ENUM('ZomerZonnewende', 'WinterZonnewende', 'NoordGroteMaanwende', 'NoordKleineMaanwende', 'ZuidGroteMaanwende', 'ZuidKleineMaanwende') NOT NULL,
    `astronomischEvent` ENUM('Ondergang', 'Opgang') NOT NULL,
    `datum` DATE NOT NULL,
    `tijd` VARCHAR(255) NOT NULL,
    `azimuthoek` DECIMAL(6, 2) NOT NULL,

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
    `hoogte` DECIMAL(6, 2) NULL,
    `foto` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `markers` ADD CONSTRAINT `fk_marker_site` FOREIGN KEY (`siteId`) REFERENCES `archeosites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `markers` ADD CONSTRAINT `fk_marker_wende` FOREIGN KEY (`wendeId`) REFERENCES `wendes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wendes` ADD CONSTRAINT `fk_wende_site` FOREIGN KEY (`siteId`) REFERENCES `archeosites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
