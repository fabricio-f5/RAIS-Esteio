USE db_webapp;

delete from `db_webapp`.`configparameter` where `parameter` = 'scanTimeMonitoringOverfill';
INSERT INTO `db_webapp`.`configparameter`
(`parameter`,`description`,`parameterValue`) VALUES ('scanTimeMonitoringOverfill','Tempo de Varredura - Monitoramento dos Overfills.',3000);

select * from `db_webapp`.`configparameter`;
