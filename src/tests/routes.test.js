const request = require('supertest');
const db = require ('../utility/database');
const {createTestProjects} = require('./projectFactory');
let app;

describe('/search', () => {
	beforeAll(async () => {
		await db.initialize();
		app = require('../app');
		// creates 10 test projects and inserts them into the database
		await createTestProjects();
	});

	test('should work a query and no filters', async () => {
		// const searchResponse = await request(app)
		// 	.get(`/search?query=`)
		console.log('hi');
	});

})