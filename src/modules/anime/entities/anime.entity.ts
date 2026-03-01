import slugify from 'slugify';
import { History } from 'src/modules/history/entities/history.entity';
import { Season } from 'src/modules/season/entities/season.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'anime' })
export class Anime {
	@PrimaryColumn({ nullable: false, type: 'varchar', unique: true })
	slug: string;

	@Column({ nullable: false, type: 'varchar', unique: true })
	title: string;

	@Column({ nullable: false, type: 'text' })
	description: string;

	@Column({ nullable: false, type: 'varchar' })
	poster: string;

	@Column({ nullable: false, type: 'varchar' })
	logo: string;

	@Column({ nullable: false, type: 'int' })
	all_episodes: number;

	@Column({ type: 'int', default: 0 })
	available_episodes: number;

	@Column({ nullable: false, type: 'int' })
	all_seasons: number;

	@Column({ type: 'int', default: 0 })
	available_seasons: number;

	@Column({ type: 'int', default: 0 })
	likes: number;

	@Column({ type: 'int', default: 0 })
	watches: number;

	@OneToMany(() => Season, (season) => season.anime)
	seasons: Season[];

	@CreateDateColumn({ type: 'timestamptz' })
	created: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deleted: Date;

	@OneToOne(() => History, (hi) => hi.anime)
	watched: History;

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		this.slug = slugify(this.title, { lower: true, trim: true });
	}
}
