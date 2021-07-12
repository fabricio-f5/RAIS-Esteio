USE db_webapp;
DELETE  FROM `db_webapp`.`route`;

INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Route','Cadastro de funcionalidades',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Profile','Cadastro de Perfis',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('User','Cadastro de Usuários',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('ConfigParameter','Configuração de Parâmetros de Sistema',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Permission','Configuração de Permissionamento',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('KeyHolder','Cadastro de Claviculário',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('AvaliableKey','Configuração de Chaves',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('MonitorKey','Monitoramento das Chaves',0);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('KeyMonitorReport','Relatório de Movimentação de Chave',0);


INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('NotFound','Recurso não Encontrado no Sistema',1);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Home','Área principal',1);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('GeneralReport','Exibe Relatório das Funcionalidades Gerais CRUDs',1);
INSERT INTO `db_webapp`.`route` (`route`,`description`,`internal`) VALUES ('Menu','Acesso ao Menu',1);
SELECT * FROM db_webapp.route;