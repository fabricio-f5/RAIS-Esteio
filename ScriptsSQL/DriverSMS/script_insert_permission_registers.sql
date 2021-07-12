USE db_webapp;
select @profileId := id from profile where profileNumber = 0;

select @nameId := id from route where route = 'DriverSMS'; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`) VALUES(@profileId,@nameId,1,1);

select @nameId := id from route where route = 'Driver'; 
DELETE  FROM permission where profile_id = @profileId and route_id = @nameId;
INSERT INTO `db_webapp`.`permission` (`profile_id`,`route_id`,`read`,`write`) VALUES(@profileId,@nameId,1,1);

Select * from permission;



