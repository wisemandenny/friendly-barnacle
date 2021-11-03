const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const data = JSON.parse(fs.readFileSync(`./utility/dataset.json`));
const PAGE_SIZE = 10;

app.use(bodyParser.json());
const helpers = {
	filterByName: (searchSet, name) => {
		const compare = name.toLowerCase();
		return searchSet.filter((project) => project["Project School Name"]?.toLowerCase().includes(compare));
	},

	filterByDesc: (searchSet, desc) => {
		const compare = desc.toLowerCase();
		return searchSet.filter((project) => project["Project Description"]?.toLowerCase().includes(compare));
	}
}
app.get('/api/search/name/:name/:page?', (req, res) => {
	const {name, page} = req.params;
	const results = helpers.filterByName(data, name);
	if (page && !isNaN(page)) {
		const min = (page - 1) * PAGE_SIZE;
		const max = page * PAGE_SIZE;
		if (min > results.length) res.json([]);
		res.json(results.slice(min, max));
	} else {
		res.json(results);
	}
})

app.get('/api/search/description/:description/:page?', (req, res) => {
	const {description, page} = req.params;
	const results = helpers.filterByDesc(data, description);
	if (page && !isNaN(page)) {
		const min = (page - 1) * PAGE_SIZE;
		const max = page * PAGE_SIZE;
		if (min > results.length) res.json([]);
		res.json(results.slice(min, max));
	} else {
		res.json(results);
	}
})

app.get('/api/search/name/:name/description/:description/:page?', (req, res) => {
	const {name, description, page} = req.params;
	let results = data;
	if (name) {
		results = helpers.filterByName(results, name);
	}
	if (description) {
		results = helpers.filterByDesc(results, description);
	}
	if (page && !isNaN(page)) {
		const min = (page - 1) * PAGE_SIZE;
		const max = page * PAGE_SIZE;
		if (min > results.length) res.json([]);
		res.json(results.slice(min, max));
	} else {
		res.json(results);
	}
})

app.patch('/api/update/:id', (req, res) => {
	const {id} = req.params;
	if (isNaN(id)) {
		throw "Id must be a valid index";
	}
	const foundProject = data[id-1];
	if (foundProject) {
		const { body } = req;
		console.log(body);
	}
})

app.get('/api/search')
// require routes
// e.g. const routes = require('./api/Folder/routes');
// use routes
// e.g. app.use('./Folder', routes);
const port = process.env.PORT || 2600;
app.listen(port);
console.log(`${new Date(Date.now()).toLocaleString()}: API running on port ${port}`);
