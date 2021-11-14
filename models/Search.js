const db = require('../utility/database');
require('dotenv').config();

class Search {
	constructor(searchQuery) {
		// need to do SQL injection protection here
		this.searchQuery = searchQuery;
		this.generateSQLQuery();
	}

	generateSQLQuery() {
		const query = {
			sql: `SELECT * FROM \`Project\` WHERE \`schoolName\` LIKE '%${this.searchQuery}%' OR \`description\` LIKE '%${this.searchQuery}%';`
		};
		this.sqlQuery = query;
	}

	async paginate(page = 1) {
		const {sql} = this.sqlQuery;
		const paginationQuery = `ORDER BY id LIMIT ${process.env.PAGE_SIZE} OFFSET ${process.env.PAGE_SIZE * (page - 1)};`
		if (sql.endsWith(';')) {
			this.sqlQuery.sql = sql.slice(0, -1).concat(paginationQuery);
		}
		return await db.run(this.sqlQuery);
	}
}

module.exports = {
	findByQuery: (query) => {
		return new Search(query);
	}
}