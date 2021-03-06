import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import db from './utility/database';
import * as projectService from './services/project.service';
import formatDate from './utility/util';
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/search', async (req, res) => {
	try {
		const { query, filters, page} = req.query;
		const results = await projectService.search(query, filters, page);
		res.json(results);
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
});

app.get('/findSimilar', async (req, res) => {
	try {
		const { id, coefficient, operand} = req.query;
		const results = await projectService.findSimilar(id, {coefficient, operand});
		res.json(results);
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
});

app.patch('/update', async (req, res) => {
	try {
		const { id, actualStartDate, phaseCostActual } = req.body;
		if (!id || isNaN(id) || (formatDate && !formatDate(actualStartDate)) || (phaseCostActual && isNaN(phaseCostActual))) {
			res.status(400).end();
		}
		const existingProject = await db.sequelize.models.Project.findByPk(Number(id));
		await projectService.update(id, actualStartDate, phaseCostActual);
		const updatedProject = await db.sequelize.models.Project.findByPk(Number(id));
		res.json({old: existingProject, updated: updatedProject});

	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
});

app.patch('/updateBulk', async (req, res) => {
	try {
		const { updates, defaults } = req.body;
		if (!updates) res.status(400).end(); // is 400 the correct error code?

		const updatedProjects = await projectService.updateBulk(updates, defaults);
		console.log(updatedProjects);
		res.status(200).json(updatedProjects);
	} catch (e) {
		console.error(e);
		res.status(500).end();
	}
});

const PORT: number = parseInt(process.env.PORT as string, 2600);
app.listen(PORT);
console.log(`${new Date(Date.now()).toLocaleString()}: API running on port ${PORT}`);
