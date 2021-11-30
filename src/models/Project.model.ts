import { Table, Column, Model, DataType, Is, IsNumeric, Default, AllowNull } from 'sequelize-typescript';
const DATE_REGEX = /\d\d\d\d \d\d \d\d/;

@Table({
	freezeTableName: true,
	paranoid: true,
})
export class Project extends Model {
	@Column
	@IsNumeric
	@AllowNull(false)
	geographicDistrict: number;

	@Column
	@Default('')
	@AllowNull(false)
	buildingIdentifier: string;

	@Column
	@Default('')
	@AllowNull(false)
	schoolName: string;

	@Column
	@Default('')
	@AllowNull(false)
	type: string;

	@Column
	@Default('')
	@AllowNull(false)
	description: string;

	@Column
	@Default('')
	@AllowNull(false)
	phaseName: string;

	@Column
	@Default('')
	@AllowNull(false)
	statusName: string;

	@Column(DataType.DATEONLY)
	@Is(DATE_REGEX)
	actualStartDate: string;

	@Column(DataType.DATEONLY)
	@Is(DATE_REGEX)
	plannedEndDate: string;

	@Column(DataType.DATEONLY)
	@Is(DATE_REGEX)
	actualEndDate: string;

	@Column
	@IsNumeric
	budgetAmount: number;

	@Column
	@IsNumeric
	phaseCostEstimate: number;

	@Column
	@IsNumeric
	phaseCostActual: number;
}