DROP SCHEMA IF EXISTS `db_webapp` ;
CREATE SCHEMA IF NOT EXISTS `db_webapp` DEFAULT CHARACTER SET utf8 ;
USE `db_webapp` ;
DROP TABLE IF EXISTS `db_webapp`.`configparameter` ;

CREATE TABLE IF NOT EXISTS `db_webapp`.`configparameter` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `parameter` VARCHAR(40) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `parameterValue` VARCHAR(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Parameter_UNIQUE` (`parameter` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;

DROP TABLE IF EXISTS `db_webapp`.`profile` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`profile` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `profileNumber` INT NOT NULL DEFAULT '0',
  `accessLevel` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `perfil_UNIQUE` (`profileNumber` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 46
DEFAULT CHARACTER SET = utf8mb3;

DROP TABLE IF EXISTS `db_webapp`.`route` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`route` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `route` VARCHAR(100) NULL DEFAULT NULL,
  `description` VARCHAR(300) NULL DEFAULT NULL,
  `internal` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Route_UNIQUE` (`route` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb3;

DROP TABLE IF EXISTS `db_webapp`.`permission` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`permission` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `profile_id` BIGINT NOT NULL,
  `Route_id` BIGINT NOT NULL,
  `read` TINYINT(1) NULL DEFAULT '0',
  `write` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`, `profile_id`, `Route_id`),
  INDEX `fk_permission_profile_idx` (`profile_id` ASC),
  INDEX `fk_permission_Route1_idx` (`Route_id` ASC),
  CONSTRAINT `fk_permission_profile`
    FOREIGN KEY (`profile_id`)
    REFERENCES `db_webapp`.`profile` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_permission_Route1`
    FOREIGN KEY (`Route_id`)
    REFERENCES `db_webapp`.`route` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 115
DEFAULT CHARACTER SET = utf8mb3;

DROP TABLE IF EXISTS `db_webapp`.`user` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `profile_id` BIGINT NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `phone` VARCHAR(11) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `cpf` VARCHAR(14) NULL DEFAULT NULL,
  `password` VARCHAR(45) NULL DEFAULT NULL,
  `status` TINYINT(1) NULL DEFAULT '0',
  `restartPassword` TINYINT(1) NULL DEFAULT '0',
  `lastLogin` DATETIME NULL DEFAULT NULL,
  `lastLogout` DATETIME NULL DEFAULT NULL,
  `activated` TINYINT(1) NULL DEFAULT '1',
  `logonUser` VARCHAR(45) NULL DEFAULT NULL,
  `rfid` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `profile_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC),
  INDEX `fk_user_profile1_idx` (`profile_id` ASC),
  CONSTRAINT `fk_user_profile1`
    FOREIGN KEY (`profile_id`)
    REFERENCES `db_webapp`.`profile` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb3;

DROP TABLE IF EXISTS `db_webapp`.`keyholder` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`keyholder` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `qtdeKeys` VARCHAR(50) NULL DEFAULT 0,
  `identification` VARCHAR(50) NULL,
  `number` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

DROP TABLE IF EXISTS `db_webapp`.`avaliablekey` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`avaliablekey` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `keyHolder_id` BIGINT NOT NULL,
  `profile_id` BIGINT NULL,
  `number` INT NOT NULL DEFAULT 0,
  `description` VARCHAR(50) NULL,
  `situation` TINYINT(1) NOT NULL DEFAULT 1,
  `user` VARCHAR(50) NULL,
  `sealNumber` VARCHAR(20) NULL,
  `exception` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`, `keyHolder_id`),
  INDEX `fk_keys_avaliable_key_holder1_idx` (`keyHolder_id` ASC),
  INDEX `fk_keys_avaliable_profile1_idx` (`profile_id` ASC),
  CONSTRAINT `fk_keys_avaliable_key_holder1`
    FOREIGN KEY (`keyHolder_id`)
    REFERENCES `db_webapp`.`keyholder` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_keys_avaliable_profile1`
    FOREIGN KEY (`profile_id`)
    REFERENCES `db_webapp`.`profile` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `db_webapp`.`reportkeyholderhistory` ;
CREATE TABLE IF NOT EXISTS `db_webapp`.`reportkeyholderhistory` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userLogon` VARCHAR(50) NULL,
  `name` VARCHAR(50) NULL,
  `keyHolder` VARCHAR(50) NULL,
  `keyNumber` INT NULL,
  `status` TINYINT(1) NULL,
  `authorizedKey` TINYINT(1) NULL,
  `email` VARCHAR(50) NULL,
  `exception`TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

USE `db_webapp`;
DROP procedure IF EXISTS `db_webapp`.`linkpermissionWithProfileAndRoute`;

DELIMITER $$
USE `db_webapp`$$
CREATE PROCEDURE `linkpermissionWithProfileAndRoute`(IN profile_id INT)
BEGIN

  DECLARE existe_mais_linhas INT DEFAULT 0;
  DECLARE route_id INT DEFAULT 0;
  DECLARE _internal TINYINT(1) DEFAULT 0;
  DECLARE meuCursor CURSOR FOR SELECT id,internal FROM db_webapp.route;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET existe_mais_linhas=1;
 OPEN meuCursor;

  meuLoop: LOOP
		  FETCH meuCursor INTO route_id,_internal;


		  IF existe_mais_linhas = 1 THEN
		  LEAVE meuLoop;
		  END IF;
			
          IF _internal = 1 THEN   
			INSERT INTO `db_webapp`.`permission` (`profile_id`,`Route_id`,`read`,`write`) VALUES (profile_id, route_id,1,1);
		  ELSE
            INSERT INTO `db_webapp`.`permission` (`profile_id`,`Route_id`,`read`,`write`) VALUES (profile_id, route_id,0,0);
		  END IF; 

  END LOOP meuLoop;
END$$

DELIMITER ;

USE `db_webapp`;
DROP procedure IF EXISTS `db_webapp`.`linkpermissionWithRouteAndProfile`;

DELIMITER $$
USE `db_webapp`$$
CREATE PROCEDURE `linkpermissionWithRouteAndProfile`(IN route_id INT,IN internal TINYINT(1))
BEGIN

  DECLARE existe_mais_linhas INT DEFAULT 0;
  DECLARE profile_id INT DEFAULT 0;
  DECLARE _profileNumber INT DEFAULT 0;
  DECLARE meuCursor CURSOR FOR SELECT id,profileNumber FROM db_webapp.profile;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET existe_mais_linhas=1;
 
  OPEN meuCursor;
  meuLoop: LOOP
		  FETCH meuCursor INTO profile_id,_profileNumber;
		  IF existe_mais_linhas = 1 THEN
		  LEAVE meuLoop;
		  END IF;
		   
          IF internal = 1 OR _profileNumber = 0 THEN 
				INSERT INTO `db_webapp`.`permission` (`profile_id`,`Route_id`,`read`,`write`) VALUES (profile_id, route_id,1,1);
		  ELSE 
				INSERT INTO `db_webapp`.`permission` (`profile_id`,`Route_id`,`read`,`write`) VALUES (profile_id, route_id,0,0);
		  END IF;

  END LOOP meuLoop;
END$$

DELIMITER ;
USE `db_webapp`;

DELIMITER $$

USE `db_webapp`$$
DROP TRIGGER IF EXISTS `db_webapp`.`profile_AFTER_INSERT` $$
USE `db_webapp`$$
CREATE
TRIGGER `db_webapp`.`profile_AFTER_INSERT`
AFTER INSERT ON `db_webapp`.`profile`
FOR EACH ROW
BEGIN
 call db_webapp.linkpermissionWithProfileAndRoute(new.id);
END$$


USE `db_webapp`$$
DROP TRIGGER IF EXISTS `db_webapp`.`route_AFTER_INSERT` $$
USE `db_webapp`$$
CREATE
TRIGGER `db_webapp`.`route_AFTER_INSERT`
AFTER INSERT ON `db_webapp`.`route`
FOR EACH ROW
BEGIN
 call db_webapp.linkpermissionWithRouteAndProfile(new.id,new.internal);
END$$

DELIMITER ;
