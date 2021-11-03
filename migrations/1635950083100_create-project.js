module.exports = {
	'up': 'CREATE TABLE IF NOT EXISTS `Project` (\n' +
	'  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
	' `geographicDistrict` int(11) DEFAULT NULL,\n' +
	' `buildingIdentifier` varchar(4) NOT NULL DEFAULT \'\',\n' +
	' `schoolName` varchar(64) NOT NULL DEFAULT \'\'\,\n' +
	' `type` varchar(32) NOT NULL DEFAULT \'\',\n' +
	' `description` varchar(128) NOT NULL DEFAULT \'\',\n' +
	' `phaseName` varchar(32) NOT NULL DEFAULT \'\',\n' +
	' `statusName` varchar(32) NOT NULL DEFAULT \'\',\n' +
	'  `actualStartDate` timestamp NULL DEFAULT NULL,\n' +
	'  `plannedEndDate` timestamp NULL DEFAULT NULL,\n' +
	'  `actualEndDate` timestamp NULL DEFAULT NULL,\n' +
	'  `budgetAmount` int(11) NULL DEFAULT NULL,\n' +
	'  `phaseCostEstimate` int(11) NULL DEFAULT NULL,\n' +
	'  `phaseCostActual` int(11) NULL DEFAULT NULL,\n' +
	'  PRIMARY KEY (`id`)\n' +
	');',
	'down': 'DROP TABLE `Project`;',
};