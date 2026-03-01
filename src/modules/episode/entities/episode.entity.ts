import slugify from 'slugify';
import { Season } from 'src/modules/season/entities/season.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Episode {
	@PrimaryColumn()
	slug: string;

	@Column({ nullable: false, type: 'varchar' })
	title: string;

	@Column({ nullable: false, type: 'int' })
	episode: number;

	@Column({ nullable: true, type: 'varchar' })
	image?: string;

	@ManyToOne(() => Season, (season) => season.episodes, { onDelete: 'CASCADE' })
	season: Season;

	@Column({ nullable: false, type: 'varchar' })
	video: string;

	@CreateDateColumn({ type: 'timestamptz' })
	created: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deleted: Date;

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		this.slug = slugify(this.title, { trim: true, lower: true });
	}
}
