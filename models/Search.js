const db = require('../utility/database');
const {sanitizeNumber, formatDate} = require('../utility/util');
require('dotenv').config();
class Search {
	constructor({query, filters, id}) {
		// need to do SQL injection protection here
		if (id) {
			this.id = id;
			this.sqlQuery = {
				sql: `SELECT * FROM \`Project\` WHERE id=${id};`
			}
			return;
		}
		this.searchQuery = query;
		this.hasFilters = Object.keys(filters).length > 0;
		if (this.hasFilters) {
			this.filters = {
				actualStartDate: filters.actualStartDate && {
					before: formatDate(filters.actualStartDate.before),
					after: formatDate(filters.actualStartDate.after),
					equals: formatDate(filters.actualStartDate.equals),
				},
				plannedEndDate: filters.plannedEndDate && {
					before: formatDate(filters.plannedEndDate.before),
					after: formatDate(filters.plannedEndDate.after),
					equals: formatDate(filters.plannedEndDate.equals),
				},
				actualEndDate: filters.actualEndDate && {
					before: formatDate(filters.actualEndDate.before),
					after: formatDate(filters.actualEndDate.after),
					equals: formatDate(filters.actualEndDate.equals),
				},
				budgetAmount: filters.budgetAmount && {
					gt: sanitizeNumber(filters.budgetAmount.gt),
					lt: sanitizeNumber(filters.budgetAmount.lt),
				},
				phaseCostEstimate: filters.phaseCostEstimate && {
					gt: sanitizeNumber(filters.phaseCostEstimate.gt),
					lt: sanitizeNumber(filters.phaseCostEstimate.lt),
				},
				phaseCostActual: filters.phaseCostActual && {
					gt: sanitizeNumber(filters.phaseCostActual.gt),
					lt: sanitizeNumber(filters.phaseCostActual.lt),
				},
			};
		}
		this.generateSQLQuery();
	}

	generateDateFilterClause(date) {
		const [[name, value]] = Object.entries(date);
		if (!value) return;
		const {before, after, equals} = value;
		const clause = [];
		if (before) {
			clause.push(`\`${name}\` < '${before}'`);
		}
		if (after) {
			clause.push(`\`${name}\` > '${after}'`);
		}
		if (equals) {
			clause.push(`\`${name}\`='${equals}'`);
		}
		return`(${clause.join(' AND ')})`;
	}

	generateCostFilterClause(cost) {
		const [[name, value]] = Object.entries(cost);
		if (!value) return;
		const {lt, gt} = value;
		const clause = [];
		if (lt) {
			clause.push(`\`${name}\` < ${lt}`);
		}
		if (gt) {
			clause.push(`\`${name}\` > ${gt}`);
		}
		const costClause = `(${clause.join(' AND ')})`;
		return costClause;
	}

	generateFiltersSQLQuery() {
		const whereClause = []
		const {actualStartDate, plannedEndDate, actualEndDate, budgetAmount, phaseCostEstimate, phaseCostActual} = this.filters;
		[{actualStartDate}, {plannedEndDate}, {actualEndDate}].forEach((date) => whereClause.push(this.generateDateFilterClause(date)));
		[{budgetAmount}, {phaseCostEstimate}, {phaseCostActual}].forEach((cost) => whereClause.push(this.generateCostFilterClause(cost)));
		return `AND (${whereClause.filter(c => c).join(' AND ')}) `;


	}

	generateSQLQuery() {
		const searchQuery = `SELECT * FROM \`Project\` WHERE (\`schoolName\` LIKE '%${this.searchQuery}%' OR \`description\` LIKE '%${this.searchQuery}%')`;
		if (this.hasFilters) {
			const filtersClause = this.generateFiltersSQLQuery();
			this.sqlQuery = {sql: searchQuery.concat(' ', filtersClause)};
		} else {
			this.sqlQuery = {sql: searchQuery};
		}
	}

	async executeSQLQuery() {
		this.sqlQuery.sql.concat(';');
		return await db.run(this.sqlQuery);
	}

	 paginate(page = 1) {
		const {sql} = this.sqlQuery;
		const paginationQuery = `ORDER BY id LIMIT ${process.env.PAGE_SIZE} OFFSET ${process.env.PAGE_SIZE * (page - 1)}`
		this.sqlQuery.sql = sql.concat(paginationQuery);
	}
}

module.exports = {
	findByQuery: (query, filters = {}) => {
		return new Search({query, filters});
	},
	findById: (id) => {
		return new Search({id});
		
	}
}