const express = require('express');
const bodyParser = require('body-parser');
const Search = require('./models/Search');
const Update = require('./models/Update');
const app = express();

app.use(bodyParser.json());

app.get('/search', async (req, res) => {
	try {
		const { query, filters, page} = req.query;
		// validate the query params (skip for demo api)
		const search = Search.findByQuery(query, filters)
		if (page) {
			search.paginate(page);
		}
		const results = await search.executeSQLQuery();
		res.json(results);
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
})

app.patch('/update', async (req, res) => {
	try {
		const { id, values } = req.body;
		if (!values) {
			res.status(400).end();
		}
		const search = Search.findById(id);
		const existingProject = await search.executeSQLQuery();
		if (!existingProject) {
			res.status(404).end();
		}
		const update = Update.updateById(id, values);
		const {affectedRows} = await update.executeSQLQuery();
		const updatedProject = await search.executeSQLQuery();
		res.json({old: existingProject, updated: updatedProject});

		// check it's a valid ID
			// if not return 404
		// else update and return updated record
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
})

const port = process.env.PORT || 2600;
app.listen(port);
console.log(`${new Date(Date.now()).toLocaleString()}: API running on port ${port}`);
