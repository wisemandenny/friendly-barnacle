const express = require('express');
const bodyParser = require('body-parser');
const Search = require('./models/Search');
const app = express();

app.use(bodyParser.json());

app.get('/search', async (req, res) => {
	const { query, page} = req.query;
	const results = await Search.findByQuery(query).paginate(page);
	res.json(results);
})

const port = process.env.PORT || 2600;
app.listen(port);
console.log(`${new Date(Date.now()).toLocaleString()}: API running on port ${port}`);
