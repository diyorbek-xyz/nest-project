import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAnimeDto } from './create-anime.dto';

export class UpdateAnimeDto extends PartialType(CreateAnimeDto) {
	@IsNumber()
	@IsOptional()
	available_episodes: number;

	@IsNumber()
	@IsOptional()
	available_seasons: number;
}
