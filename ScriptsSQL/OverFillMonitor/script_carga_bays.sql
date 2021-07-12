use db_overfill;
delete from `monitorBay`;

INSERT INTO `monitorBay` (`bayNumber`,`bayName`,`bayType`,`truck_id`, `tripNumber`, `compartAudited`, `status`, `busy`) VALUES
(1,'Baia 01', 'TOP',null,null, 0, 0, 0),
(2,'Baia 02', 'TOP',null,null, 0, 0, 0),
(3,'Baia 03', 'Bottom',null,null, 0, 0, 0),
(5,'Baia 05', 'Bottom',null,null, 0, 0, 0),
(7,'Baia 07', 'Bottom',null,null, 0, 0, 0),
(9,'Baia 09', 'Bottom',null,null, 0, 0, 0),
(10,'Baia 10', 'Bottom',null,null, 0, 0, 0),
(12,'Baia 12', 'Bottom',null,null, 0, 0, 0);
