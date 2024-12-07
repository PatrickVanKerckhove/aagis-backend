/*
  Warnings:

  - The values [zomerZonnewende,winterZonnewende,noordGroteMaanwende,noordKleineMaanwende,zuidGroteMaanwende,zuidKleineMaanwende] on the enum `wendes_wendeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ondergang,opgang] on the enum `wendes_astronomischEvent` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `idx_archeosite_foto_unique` ON `archeosites`;

-- AlterTable
ALTER TABLE `wendes` MODIFY `wendeType` ENUM('ZomerZonnewende', 'WinterZonnewende', 'NoordGroteMaanwende', 'NoordKleineMaanwende', 'ZuidGroteMaanwende', 'ZuidKleineMaanwende') NOT NULL,
    MODIFY `astronomischEvent` ENUM('Ondergang', 'Opgang') NOT NULL;
