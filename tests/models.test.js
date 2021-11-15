const Search = require('../models/Search');
const Update = require('../models/Update');
require('dotenv').config();

describe('Models Tests', () => {
	describe('Search Model Tests', () => {
		describe('constructor', () => {
			test('should create with id and sqlQuery if given just id', () => {
				const search = Search.findById(1);
				expect(search.id).toBe(1);
				expect(search.sqlQuery).toMatchObject({sql:`SELECT * FROM \`Project\` WHERE id=1`});
			});

			test('should fail if not given a number for id', () => {
				const search = Search.findById('not a number');
				expect(search.id).toBeUndefined();
				expect(search.sqlQuery).toBeUndefined();
			});

			test('should create with query and !hasFilters if just given query', () => {
				const search = Search.findByQuery('query');
				expect(search.searchQuery).toBe('query');
				expect(search.hasFilters).toBe(false);
				expect(search.sqlQuery).toMatchObject({
					sql: `SELECT * FROM \`Project\` WHERE (\`schoolName\` LIKE '%query%' OR \`description\` LIKE '%query%')`
				});
			});

			test('should create with query and filters if given query and filters', () => {
				const filters = {
					actualStartDate: {after: '01/01/1970'},
					budgetAmount: {gt: '1'},
				};

				const search = Search.findByQuery('query', filters);
				expect(search.searchQuery).toBe('query');
				expect(search.hasFilters).toBe(true);
				expect(search.filters.actualStartDate.after).toBe('1970-01-01 00:00:00');
				expect(search.filters.budgetAmount.gt).toBe(1);
				expect(search.sqlQuery).toMatchObject({
					sql: `SELECT * FROM \`Project\` WHERE (\`schoolName\` LIKE '%query%' OR \`description\` LIKE '%query%') AND ((\`actualStartDate\` > '1970-01-01 00:00:00') AND (\`budgetAmount\` > 1)) `
				})
			});
		});

		describe('paginate', () => {
			test ('should add offset query', () => {
				const search = Search.findById(1);
				search.paginate(1);
				expect(search.id).toBe(1);
				expect(search.sqlQuery).toMatchObject({
					sql: `SELECT * FROM \`Project\` WHERE id=1 ORDER BY id LIMIT ${process.env.PAGE_SIZE} OFFSET ${process.env.PAGE_SIZE * 0}`
				});
			});
		});
	})

	describe('Update Model Tests', () => {
		describe('constructor', () => {
			test('should create update instance with valid members', () => {
				const updates = {actualStartDate: '01/01/1970', phaseCostActual: '402'};
				const update = Update.updateById(1, updates);
				expect(update.id).toBe(1);
				expect(update.updates).toMatchObject({
					actualStartDate: '1970-01-01 00:00:00',
					phaseCostActual: 402,
				});
				expect(update.sqlQuery).toMatchObject({
					sql: `UPDATE \`Project\` SET \`actualStartDate\`='1970-01-01 00:00:00', \`phaseCostActual\`='402' WHERE \`id\`=1`
				});
			});
		});
	})
})