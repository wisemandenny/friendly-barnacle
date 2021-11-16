const moment = require('moment');

const sanitizeString = function (string) {
	return Object.prototype.toString.call(string) === "[object String]" && string.replace(/'/g, '');
}

const sanitizeNumber = function (number) {
	return !isNaN(number) && Number(number);
}

const formatDate = function (date) {
	if (!date) return null;
	const cleanDate = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
	return cleanDate !== 'Invalid date' ? cleanDate : null;
}

module.exports = {
	sanitizeString, sanitizeNumber, formatDate,
}
