USE db_webapp;
DELETE  FROM `db_webapp`.`route` WHERE route = 'DriverSMS';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('DriverSMS','Interface com os Motoristas para envio de SMS/Pager',0);

DELETE  FROM `db_webapp`.`route` WHERE route = 'Driver';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Driver','Cadastro de Motoristas para envio de SMS/Pager',0);

SELECT * FROM db_webapp.route;