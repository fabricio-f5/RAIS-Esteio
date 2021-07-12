USE db_webapp;
DELETE  FROM `db_webapp`.`route` WHERE route = 'Truck';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Truck','Monitoramento de Baias - Cadastro de AT',0);

DELETE  FROM `db_webapp`.`route` WHERE route = 'MonitorOverfill';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('MonitorOverfill','Monitoramento condição dos Overfills.',0);

DELETE  FROM `db_webapp`.`route` WHERE route = 'OverfillReport';
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('OverfillMonitorReport','Relatório da Situação dos Overfills',0);

SELECT * FROM db_webapp.route;

