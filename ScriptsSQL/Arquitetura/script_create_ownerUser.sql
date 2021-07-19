USE db_webapp;
delete from user where email = 'rais.terminal@f5automation.com.br';
Select  @profile_id := id from db_webapp.profile Where profileNumber = 0;
INSERT INTO db_webapp.user  (`profile_id`,`name`,`phone`,`email`,`cpf`,`password`,`status`,`restartPassword`,`lastLogin`,`lastLogout`,`activated`,`logonUser`,`rfid`) VALUES
( @profile_id,'F5 Automação',null,'rais.terminal@f5automation.com.br',null,'91797bf249fe60f3a833676b3a0500b9',0,0,null,null,1,'f5automation',null);
select * from user;

