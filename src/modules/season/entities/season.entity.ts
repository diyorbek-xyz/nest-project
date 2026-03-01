import slugify from 'slugify';
import { Anime } from 'src/modules/anime/entities/anime.entity';
import { Episode } from 'src/modules/episode/entities/episode.entity';
import { History } from 'src/modules/history/entities/history.entity';
import { Studio } from 'src/modules/studio/entities/studio.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'season' })
export class Season {
	@PrimaryColumn()
	slug: string;

	@Column({ nullable: false, type: 'varchar' })
	title: string;

	@Column({ nullable: false, type: 'int' })
	all_episodes: number;

	@Column({ type: 'int', default: 0 })
	available_episodes: number;

	@Column({ nullable: true, type: 'varchar' })
	image?: string;

	@ManyToOne(() => Studio, (studio) => studio.seasons, { nullable: false })
	studio: Studio;

	@ManyToOne(() => Anime, (anime) => anime.seasons, { onDelete: 'CASCADE' })
	anime: Anime;

	@OneToMany(() => Episode, (ep) => ep.season)
	episodes: Episode[];

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
