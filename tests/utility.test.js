const { sanitizeString, sanitizeNumber, formatDate } = require('../utility/util');
const moment = require('moment');

describe('Utility Tests', () => {
	describe('sanitizeString', () => {
		test('should return identical string if string doesn\'t have any single quotes', () => {
			const testString = 'this is a test string';
			expect(sanitizeString(testString)).toBe('this is a test string');
		});

		test('should return string with no single quotes given a string with single quotes', () => {
			const testString = `thisn't s'much ain't goin' t'challa's`;
			expect(sanitizeString(testString)).toBe('thisnt smuch aint goin tchallas');
		});

		test('should return false if not given a string', () => {
			const test = 1;
			expect(sanitizeString(test)).toBe(false);
		})
	});

	describe('sanitizeNumber', () => {
		test('should return a Number type when given a Number', () => {
			const result = sanitizeNumber(1);
			expect(typeof result).toBe('number');
			expect(result).toBe(1);
		});

		test('should return a Number representation when given a string number', () => {
			const result = sanitizeNumber('402');
			expect(typeof result).toBe('number');
			expect(result).toBe(402);
		});

		test('should return false when given not a number', () => {
			const notANumber = sanitizeNumber('asdadadsa');
			const notANumber2 = sanitizeNumber(NaN);
			expect(notANumber).toBe(false);
			expect(notANumber2).toBe(false);
		})		
	});

	describe('formatDate', () => {
		// should return a date when given MM//DD//YYYY w/ format YYYY-MM-DD HH:mm:ss
		test('should return date with format YYYY-MM-DD HH:mm:ss when given a date string of format MM/DD/YYYY', () => {
			const dateString = '01/01/1970';
			const result = formatDate(dateString);
			expect(moment(result, 'YYYY-MM-DD HH:mm:ss')).not.toBe('Invalid date');
			expect(moment(result, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')).toBe(dateString);
		})

		test('should return false when given an invalid format date string', () => {
			const dateString = '1970/01/01';
			const result = formatDate(dateString);
			expect(result).toBe(false);
		});

		test('should return false when not given a date string', () => {
			const dateString = 402;
			const result = formatDate(dateString);
			expect(result).toBe(false);
		})

		// should return false otherwise
	});
})