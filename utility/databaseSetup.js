const fs = require('fs');
const util = require('util');
const db = require('./database.js');
require('dotenv').config();
const setup = async () => {
	const jsonFilename = 'dataset.json';
	const data = JSON.parse(fs.readFileSync(`./utility/${jsonFilename}`));
	if (data) {
		for (const project of data) {
			const p = {
				geographicDistrict: project["Project Geographic District"],
				buildingIdentifier: project["Project Building Identifier"],
				schoolName: project["Project School Name"],
				type: project["Project Type"],
				description: project["Project Description"],
				phaseName: project["Project Phase Name"],
				statusName: project["Project Status Name"],
				actualStartDate: new Date(project["Project Phase Actual Start Date"]), // add valid
				plannedEndDate: new Date(project["Project Phase Planned End Date"]),// add valid
				actualEndDate: new Date(project["Project Phase Actual End Date"]),// add valid
				budgetAmount: !isNaN(project["Project Budget Amount"]) ? Number(project["Project Budget Amount"]) : null,
				phaseCostEstimate: !isNaN(project["Final Estimate of Actual Costs Through End of Phase Amount"]) ? Number(project["Final Estimate of Actual Costs Through End of Phase Amount"]) : null,
				phaseCostActual: !isNaN(project["Total Phase Actual Spending Amount"]) ? Number(project["Total Phase Actual Spending Amount"]) : null,
			};
			const insertedProjectId = await db.run(
				db.query({
					sql: "INSERT INTO `Project` (geographicDistrict, buildingIdentifier, schoolName, type, description, phaseName, statusName, actualStartDate, plannedEndDate, actualEndDate, budgetAmount, phaseCostEstimate, phaseCostActual)"
				+ `VALUES ('${p.geographicDistrict}', '${p.buildingIdentifier}', '${p.schoolName}', '${p.type}', '${p.description}', '${p.phaseName}', '${p.statusName}', '${p.actualStartDate}', '${p.plannedEndDate}', '${p.actualEndDate}', '${p.budgetAmount}', '${p.phaseCostEstimate}', '${p.phaseCostActual}');`})
			);

			if (project["DSF Number(s)"]?.startsWith("DSF: ")) {
				const dsf = project["DSH Numbers(s)"].slice(5).split(", ");
				for (const d of dsf) {
					await db.run(
						db.query("INSERT INTO `DSF` (projectId, number) VALUES (" + `'${insertedProjectId}', '${d}');`)
					);
				}
				
			}
		}
	}
}

setup();