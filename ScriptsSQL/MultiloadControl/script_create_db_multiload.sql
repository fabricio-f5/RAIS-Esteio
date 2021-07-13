DROP SCHEMA IF EXISTS `db_multiload` ;

CREATE SCHEMA IF NOT EXISTS `db_multiload` DEFAULT CHARACTER SET utf8 ;
USE `db_multiload` ;

DROP TABLE IF EXISTS `db_multiload`.`multiloadControl` ;

CREATE TABLE IF NOT EXISTS `db_multiload`.`multiloadControl` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `platform` VARCHAR(50) NULL,
  `bayNumber` INT NULL DEFAULT 0,
  `bayName` VARCHAR(50) NULL,
  `bayStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `measureStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `maintenanceStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `bayScriptPath` TEXT NULL,
  `measureScriptPath` TEXT NULL,
  `maintenanceScriptPath` TEXT NULL,
  `ip` VARCHAR(15) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

DROP TABLE IF EXISTS `db_multiload`.`historyMultiloadControl` ;
CREATE TABLE IF NOT EXISTS `db_multiload`.`historyMultiloadControl` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` VARCHAR(50) NULL,
  `platform` VARCHAR(50) NULL,
  `bayNumber` INT NULL,
  `bayName` VARCHAR(50) NULL,
  `action` TEXT NULL,
  `bayStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `measureStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `maintenanceStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `reason` TEXT NULL,
  `actionDateON` DATETIME NULL,
  `actionDateOFF` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;
