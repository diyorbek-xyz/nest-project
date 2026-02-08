import { AnimeType } from '../entities/anime.entity';

export class AnimeDto {
	id: number;
	title: string;
	director: string;
	type: AnimeType;
}
