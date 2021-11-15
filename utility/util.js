const moment = require('moment');

const sanitizeString = function (string) {
	return Object.prototype.toString.call(string) === "[object String]" && string.replace(/'/g, '');
}

const sanitizeNumber = function (number) {
	return !isNaN(number) && Number(number);
}

const formatDate = function (date) {
	const cleanDate = moment(date, 'MM/DD/YYYY').format("YYYY-MM-DD HH:mm:ss");
	return cleanDate !== 'Invalid date' && cleanDate;
}

module.exports = {
	sanitizeString, sanitizeNumber, formatDate,
}
