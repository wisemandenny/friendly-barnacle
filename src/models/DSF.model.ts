import { Table, Column, Model, IsNumeric, ForeignKey } from 'sequelize-typescript';
import { Project } from './Project.model';
@Table({
	freezeTableName: true,
	paranoid: true,
})
export class DSF extends Model {
	@ForeignKey(() => Project)
	@Column
	projectId: number;

	@Column
	@IsNumeric
	number: string;
}