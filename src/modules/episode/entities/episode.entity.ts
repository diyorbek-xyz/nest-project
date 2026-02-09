import { SeasonEntity } from 'src/modules/season/entities/season.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'episode' })
export class EpisodeEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'episode' })
	title: string;

	@Column({ default: 0 })
	episode: number;

	@Column({ default: '' })
	video: string;

	@Column({ default: '' })
	previews: string;

	@Column({ default: '' })
	poster: string;

	@Column({ default: '' })
	folder: string;

	@ManyToOne(() => SeasonEntity, (season) => season.episodes)
	season: EpisodeEntity;
}
