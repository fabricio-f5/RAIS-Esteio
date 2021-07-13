USE db_webapp;
select @profileId := id from profile where profileNumber = 0;

select @nameId := id from route where route = 'Route'; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'Profile' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'User' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'ConfigParameter' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'Permission' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'KeyHolder' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'Avaliablekey' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'Monitorkey' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

select @nameId := id from route where route = 'KeyMonitorReport' ; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`,`delete`) VALUES(@profileId,@nameId,1,1,1);

Select * from permission;



