import { AnimeEntity } from 'src/modules/anime/entities/anime.entity';
import { EpisodeEntity } from 'src/modules/episode/entities/episode.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'season' })
export class SeasonEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'season' })
	title: string;

	@Column({ default: 0 })
	season: number;

	@Column({ default: 'poster' })
	poster: string;

	@ManyToOne(() => AnimeEntity, (anime) => anime.seasons)
	anime: AnimeEntity;

	@OneToMany(() => EpisodeEntity, (episode) => episode.season)
	episodes: EpisodeEntity[];
}
