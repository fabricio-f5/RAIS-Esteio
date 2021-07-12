-- -----------------------------------------------------
-- Schema db_overfill
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `db_overfill` ;

CREATE SCHEMA IF NOT EXISTS `db_overfill` DEFAULT CHARACTER SET utf8 ;
USE `db_overfill` ;
DROP TABLE IF EXISTS `db_overfill`.`truck` ;

CREATE TABLE IF NOT EXISTS `db_overfill`.`truck` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `at` VARCHAR(7) NULL,
  `totalCompart` INT NOT NULL DEFAULT 0,
  `capacity` INT NOT NULL DEFAULT 0,
  `b_train` TINYINT(1) NOT NULL DEFAULT 0,
  `compartFirstTrain` INT NOT NULL DEFAULT 0,
  `compartSecondTrain` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


DROP TABLE IF EXISTS `db_overfill`.`monitorBay` ;
CREATE TABLE IF NOT EXISTS `db_overfill`.`monitorBay` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `bayNumber` INT NULL DEFAULT 0,
  `bayName` VARCHAR(20) NULL,
  `bayType` VARCHAR(20) NULL,
  `truck_id` BIGINT NULL,
  `tripNumber` VARCHAR(10) NULL,
  `compartAudited` INT NULL DEFAULT 0,
  `status` TINYINT(1) NULL DEFAULT 0,
  `busy` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_monitorBay_truck_idx` (`truck_id` ASC),
  CONSTRAINT `fk_monitorBay_truck`
    FOREIGN KEY (`truck_id`)
    REFERENCES `db_overfill`.`truck` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `db_overfill`.`historyMonitorBay` ;
CREATE TABLE IF NOT EXISTS `db_overfill`.`historyMonitorBay` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bayNumber` INT NULL,
  `bayName` VARCHAR(20) NULL,
  `bayType` VARCHAR(20) NULL,
  `at` VARCHAR(7) NULL,
  `tripNumber` VARCHAR(10) NULL,
  `capacity` INT NULL,
  `b_train` TINYINT(1) NULL,
  `totalCompart` INT NULL,
  `compartFirstTrain` INT NULL,
  `compartSecondTrain` INT NULL,
  `compartAudited` INT NULL,
  `status` TINYINT(1) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;
