const faker = require('faker');
const moment = require('moment');
const projectService = require('../services/project.service');

const coinFlip = () => {
	return Math.floor(Math.random() * 2) === 1;
}

// generate 1-5 DSF numbers
const generateDsfs = () => {
	const count = Math.floor(Math.random() * 4) + 1;
	const DSFs = Array.from(Array(count)).map((idx) => `0000${faker.datatype.number(999999)}`);
	return `DSF: ${DSFs.join(', ')}`;
}

const generateProject = async (props = {}) => {
	const project = {
		"Project Geographic District": faker.datatype.number(15),
		"Project Building Identifier": faker.random.alphaNumeric(5),
		"Project School Name": faker.random.words(3),
		"Project Type": faker.random.words(2),
		"Project Description": faker.random.words(3),
		"Project Phase Name": faker.hacker.verb(),
		"Project Status Name": faker.hacker.verb(),
		"Project Phase Actual Start Date": coinFlip ? moment(faker.date.past(), 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MM/DD/YYYY') : null,
		"Project Phase Planned End Date": coinFlip ? moment(faker.date.future(), 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MM/DD/YYYY') : null,
		"Project Phase Actual End Date": coinFlip ? moment(faker.date.future(), 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MM/DD/YYYY') : null,
		"Project Budget Amount": faker.datatype.number(),
		"Final Estimate of Actual Costs Through End of Phase Amount": faker.datatype.number(),
		"Total Phase Actual Spending Amount": coinFlip ? faker.datatype() : null,
		"DSF Number(s)": generateDsfs(),
	};

	return {...project, ...props};
}

const createTestProjects = async (count = 10) => {
	const projects = await Promise.all(Array.from(Array(count)).map((idx) => generateProject()));
	await Promise.all(projects.map((project) => projectService.create(project)));
}

module.exports = {
	createTestProjects,
	generateProject,
};