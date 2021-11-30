import fs from 'fs';
import JSONStream from 'JSONStream';
import es from 'event-stream';
import projectService from '../services/project.service';
import db from './database';
import dotenv from 'dotenv';


const getStream = () => {
	dotenv.config();
	const stream = fs.createReadStream(`src/utility/${process.env.JSON_FILENAME}`);
	const parser = JSONStream.parse('*');
	return stream.pipe(parser);
}

const setup = async () => {
	console.log('Creating tables...');
	await db.sequelize.sync();
	console.log('Tables created.');
	console.log('inserting data from json file...');
	const stream = getStream();
	stream.pipe(es.map(async (project: any) => { // TODO: add an interface here for project
		try {
			await projectService.create(project);
		} catch (e) {
			console.error(e);
		}
	}));
}
setup();