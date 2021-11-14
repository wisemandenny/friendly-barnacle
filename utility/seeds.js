const fs = require('fs');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const util = require('util');
const db = require('./database.js');
const moment = require('moment');
require('dotenv').config();

const getStream = function () {
	const stream = fs.createReadStream(`./utility/${process.env.JSON_FILENAME}`)
	const parser = JSONStream.parse('*');
	return stream.pipe(parser);
}

const sanitizeString = function (string) {
	return Object.prototype.toString.call(string) === "[object String]" && string.replace(/'/g, '');
}

const sanitizeNumber = function (number) {
	return !isNaN(number) && Number(number);
}

const insertDsf = async function (projectId, dsf) {
	await db.run(
		{
			sql:`INSERT INTO \`DSF\` (projectId, number) VALUES ('${projectId}', '${dsf}');`
		}
	)
}

const insertDsfs = async function (projectId, dsfField) {
	if (dsfField?.startsWith("DSF: ")) {
		const dsfs = dsfField.slice(5).split(", ");
		for (const dsf of dsfs) {
			await insertDsf(projectId, dsf)
		}
	}
}

const insertProject = async function(project) {
	const p = {
		geographicDistrict: santizeNumber(project["Project Geographic District"]),
		buildingIdentifier: sanitizeString(project["Project Building Identifier"]),
		schoolName: sanitizeString(project["Project School Name"]),
		type: sanitizeString(project["Project Type"]),
		description: sanitizeString(project["Project Description"]),
		phaseName: sanitizeString(project["Project Phase Name"]),
		statusName: sanitizeString(project["Project Status Name"]),
		actualStartDate: moment(project["Project Phase Actual Start Date"], 'MM/DD/YYYY').format("YYYY-MM-DD HH:mm:ss"),
		plannedEndDate: moment(project["Project Phase Planned End Date"], 'MM/DD/YYYY').format("YYYY-MM-DD HH:mm:ss"),
		actualEndDate: moment(project["Project Phase Actual End Date"], 'MM/DD/YYYY').format("YYYY-MM-DD HH:mm:ss"),
		budgetAmount: santizeNumber(project["Project Budget Amount"]),
		phaseCostEstimate: sanitizeNumber(project["Final Estimate of Actual Costs Through End of Phase Amount"]),
		phaseCostActual: santizeNumber(project["Total Phase Actual Spending Amount"]),
	};
	const tuples = Object.entries(p).filter(([key, value]) => value && value !== 'Invalid date');
	const keys = tuples.map(([k, v]) => k).join(', ');
	const values = tuples.map(([k, v]) => `'${v}'`).join(', ');
	const [result] = await db.run(
		{
			sql: `INSERT INTO \`Project\` (${keys}) VALUES (${values});`
	});
	const {insertId} = result;
	await insertDsfs(insertId, project["DSF Number(s)"])
}


const setup = async function() {
	console.log('inserting data from json file...');
	const stream = getStream();
	stream.pipe(es.map(function (project) {
		try {
			insertProject(project);
		} catch (e) {
			console.error(e);
		}
	}));
}

setup()