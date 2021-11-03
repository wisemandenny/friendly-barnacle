module.exports = {
	'up': 'CREATE TABLE IF NOT EXISTS `DSF` (\n ' +
	'  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
	' `projectId` int(11) NOT NULL,\n' + 
	'  `number` varchar(10) NOT NULL DEFAULT \'\',\n' +
	'  PRIMARY KEY (`id`),\n' +
	'  KEY `projectId` (`projectId`),\n' +
	'  CONSTRAINT `DSF_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)\n' +
	')',
	'down': 'DROP TABLE `DSF`',
};