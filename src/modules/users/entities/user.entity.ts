import { UserRole } from 'src/modules/common/enum/user_role';
import { History } from 'src/modules/history/entities/history.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', unique: true, nullable: false, update: false })
	username: string;

	@Column({ type: 'varchar', nullable: false, unique: true })
	email: string;

	@Column({ type: 'text', nullable: false })
	password: string;

	@Column({ type: 'varchar', nullable: false })
	firstName: string;

	@Column({ type: 'varchar', nullable: true })
	lastName: string;

	@Column({ type: 'text', nullable: true })
	bio: string;

	@Column({ type: 'varchar', nullable: false, enum: UserRole, update: true, default: UserRole.USER })
	role: UserRole;

	@Column({ type: 'varchar', nullable: true })
	avatar: string;

	@OneToMany(() => History, (history) => history.user)
	history: History[];

	@CreateDateColumn({ type: 'timestamptz' })
	created: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deleted: Date;

	static getKeys(exclude: (keyof User)[]) {
		return (Object.keys(new this()) as (keyof User)[]).filter((e) => !exclude.includes(e));
	}
}
