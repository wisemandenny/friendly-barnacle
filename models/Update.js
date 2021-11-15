const db = require('../utility/database');
const {sanitizeNumber, formatDate} = require('../utility/util');

class Update {
	constructor({id, actualStartDate, phaseCostActual}) {
		this.id = id;
		this.updates = {};
		if (actualStartDate) {
			this.updates.actualStartDate = formatDate(actualStartDate);
		}
		if (phaseCostActual) {
			this.updates.phaseCostActual = sanitizeNumber(phaseCostActual);
		}
		this.generateSQLQuery();
	}

	generateSQLQuery() {
		const tuples = Object.entries(this.updates).map(([k ,v]) => `\`${k}\`='${v}'`);
		const sql = `UPDATE \`Project\` SET ${tuples.join(', ')} WHERE \`id\`=${this.id}`;
		this.sqlQuery = {sql};
	}

	async executeSQLQuery() {
		return await db.run(this.sqlQuery);
	}
}

module.exports = {
	updateById: (id, {actualStartDate, phaseCostActual}) => {
		return new Update({id, actualStartDate, phaseCostActual});
	}
}