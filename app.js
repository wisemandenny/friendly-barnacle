const express = require('express');
const bodyParser = require('body-parser');
const Search = require('./models/Search');
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

const port = process.env.PORT || 2600;
app.listen(port);
console.log(`${new Date(Date.now()).toLocaleString()}: API running on port ${port}`);
