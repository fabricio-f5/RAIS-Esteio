USE db_webapp;
DELETE  FROM `db_webapp`.`route` WHERE route = 'MultiloadControl';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('MultiloadControl','Controle de Pesos e Medidas do Multiload',0);

DELETE  FROM `db_webapp`.`route` WHERE route = 'MultiloadControlReport';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('MultiloadControlReport','Relatório Rastreabilidade Pesos e medidas do Multiload',0);

SELECT * FROM db_webapp.route;

