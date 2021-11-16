const db = require('../utility/database');
const {formatDate} = require('../utility/util');
const {Project, DSF} = db;
const {Op} = db.Sequelize;
require('dotenv').config();

exports.create = async (project) => {
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
};

exports.search = async (query, filters, page) => {
	const hasFilters = filters && Object.entries(filters).length > 0;
	const mappedFilters = hasFilters 
		? {
			[Op.and]: Object.entries(filters).map(([attribute, attributeFilters]) => ({
				[attribute]: {
					[Op.and]: Object.entries(attributeFilters).map(([operator, operand]) => {
						if (attribute.includes('Date')) {
							operand = formatDate(operand);
						}
						if (operator === 'lt' || operator === 'before') {
							return {[Op.lt]: operand};
						}
						if (operator === 'gt' || operator === 'after') {
							return {[Op.gt]: operand};
						}
						if (operator === 'eq' || operator === 'equals') {
							return {[Op.eq]: operand};
						}
				})}
			}))
		}
		: undefined;

	const pagination = page ? {offset: process.env.PAGE_SIZE * (Number(page) - 1), limit: Number(process.env.PAGE_SIZE)} : undefined;
	return await Project.findAll({
		where: {
			[Op.and]: {
				[Op.or]: {
					schoolName: {
						[Op.like]: `%${query}%`,
					},
					description: {
						[Op.like]: `%${query}%`,
					},
				},
				...mappedFilters,
			}
		},
		...pagination,
		order: [['id', 'ASC']],
	});
}

exports.update = async (id, rawActualStartDate, rawPhaseCostActual) => {
	const actualStartDate = rawActualStartDate ? formatDate(rawActualStartDate) : undefined;
	const phaseCostActual = rawPhaseCostActual ? Number(rawPhaseCostActual) : undefined;
	const test = {...{actualStartDate, phaseCostActual}};
	return await Project.update(
		{...{actualStartDate, phaseCostActual}},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
	});
}