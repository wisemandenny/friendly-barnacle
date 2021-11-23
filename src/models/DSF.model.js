const Project = require('./Project.model');

module.exports = (sequelize, Sequelize) => {
	const DSF = sequelize.define("DSF", {
		projectId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'Project',
				key: 'id',
			},
			allowNull: false,
		},
		number: {
			type: Sequelize.STRING,
			allwNull: false,
			defaultValue: '',
			validate: {
				isNumeric: true,
			},
		},
	},
	{
		freezeTableName: true,
		paranoid: true,
	});
	return DSF;
};