module.exports = (sequelize, Sequelize) => {
	const dateValidation = {
		is: /\d\d\d\d \d\d \d\d/
	};

	const Project = sequelize.define("Project", {
		geographicDistrict: {
			type: Sequelize.INTEGER,
			validate: {
				isNumeric: true,
			},
		},
		buildingIdentifier: {
			type: Sequelize.STRING,
			defaultValue: '',
			allowNull: false,
		},
		schoolName: {
			type: Sequelize.STRING,
			defaultValue: '',
			allowNull: false,
		},
		type: {
			type: Sequelize.STRING,
			defaultValue: '',
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
			defaultValue: '',
			allowNull: false,
		},
		phaseName: {
			type: Sequelize.STRING,
			defaultValue: '',
			allowNull: false,
		},
		statusName: {
			type: Sequelize.STRING,
			defaultValue: '',
			allowNull: false,
		},
		actualStartDate: {
			type: Sequelize.DATEONLY,
			validation: dateValidation,
		},
		plannedEndDate: {
			type: Sequelize.DATEONLY,
			validation: dateValidation,
		},
		actualEndDate: {
			type: Sequelize.DATEONLY,
			validation: dateValidation,
		},
		budgetAmount: {
			type: Sequelize.INTEGER,
			validate: {
				isNumeric: true,
			},
		},
		phaseCostEstimate: {
			type: Sequelize.INTEGER,
			validate: {
				isNumeric: true,
			},
		},
		phaseCostActual: {
			type: Sequelize.INTEGER,
			validate: {
				isNumeric: true,
			},
		},
	},
	{
		freezeTableName: true,
	});
	return Project;
}