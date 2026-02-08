import { EpisodeEntity } from 'src/modules/episode/entities/episode.entity';
import { SeasonEntity } from 'src/modules/season/entities/season.entity';
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
export enum AnimeType {
	MOVIE = 'movie',
	SERIES = 'series',
}

@Entity({ name: 'anime' })
export class AnimeEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	director: string;

	@Column({ type: 'enum', enum: AnimeType, default: AnimeType.SERIES })
	type: AnimeType;

	@OneToMany(() => SeasonEntity, (season) => season.anime)
	seasons: SeasonEntity[];
}
