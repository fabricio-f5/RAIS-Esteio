USE db_webapp;
delete from `db_webapp`.`configparameter`;

INSERT INTO `db_webapp`.`configparameter`
(`parameter`,`description`,`parameterValue`) VALUES ('createUsersByAdmin','Identifica se usuário irá cadastrar sua própria conta, ou se será cadastrada pelo Administrador. Valores: 0-Próprio usuário cria a conta 1-Administrador cria a conta.',1);

INSERT INTO `db_webapp`.`configparameter`
(`parameter`,`description`,`parameterValue`) VALUES ('scanTimeMonitoringKey','Tempo de Varredura - Monitoramento dos Claviculários.',3000);

INSERT INTO `db_webapp`.`configparameter`
(`parameter`,`description`,`parameterValue`) VALUES ('SupervisorEmail','E-mail destino para mensagens de aviso caso o usuário pegue uma chave que não seja do seu perfil de acesso.','adenirtoniolofilho@gmail.com');

INSERT INTO `db_webapp`.`configparameter`
(`parameter`,`description`,`parameterValue`) VALUES ('PurgeReport','Período de retenção dos dados do relatório em dias.',100);

select * from `db_webapp`.`configparameter`;


