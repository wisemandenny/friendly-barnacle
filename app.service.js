const db = require('./database/database');
const {formatDate} = require('./utility/util');
const {Project, DSF} = db;
const Op = db.sequelize.Op;

exports.createProject = async (project) => {
	const newProject = await Project.create({
		geographicDistrict: project['Project Geographic District'],
		buildingIdentifier: project['Project Building Identifier'],
		schoolName: project['Project School Name'],
		type: project['Project Type'],
		description: project['Project Description'],
		phaseName: project['Project Phase Name'],
		statusName: project['Project Status Name'],
		actualStartDate: formatDate(project['Project Phase Actual Start Date']),
		plannedEndDate: formatDate(project['Project Phase Planned End Date']),
		actualEndDate: formatDate(project['Project Phase Actual End Date']),
		budgetAmount: !(isNaN(project['Project Budget Amount'])) ? Number(project['Project Budget Amount']) : null,
		phaseCostEstimate: project['Final Estimate of Actual Costs Through End of Phase Amount'],
		phaseCostActual: project['Total Phase Actual Spending Amount'],
	});

	const { id: projectId } = newProject;

	const dsfField = project['DSF Number(s)'];
	if (dsfField?.startsWith('DSF: ')) {
		const dsfs = dsfField.slice(5).split(', ');
		dsfs.forEach(async (dsf) => {
			await DSF.create({
				projectId,
				number: dsf,
			});
		});
	}
}