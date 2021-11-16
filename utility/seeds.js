const fs = require('fs');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const projectService = require('../project.service');
const db = require('../database/database');

require('dotenv').config();

const getStream = function () {
	const stream = fs.createReadStream(`./utility/${process.env.JSON_FILENAME}`)
	const parser = JSONStream.parse('*');
	return stream.pipe(parser);
}

const setup = async function() {
	console.log('Creating tables...')
	await db.sequelize.sync();
	console.log('Tables created.')
	console.log('inserting data from json file...');
	const stream = getStream();
	stream.pipe(es.map(async function (project) {
		try {
			await projectService.create(project);
		} catch (e) {
			console.error(e);
		}
	}));
}
setup();