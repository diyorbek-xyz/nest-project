import { IsAlphanumeric, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAnimeDto {
	@IsNotEmpty()
	@IsAlphanumeric()
	title: string;
	
	@IsNotEmpty()
    @IsAlphanumeric()
	description: string;

	@IsNotEmpty()
	@IsString()
	poster: string;

	@IsNotEmpty()
	@IsString()
	logo: string;

	@IsNotEmpty()
	@IsNumber()
	all_episodes: number;
	
	@IsNotEmpty()
    @IsNumber()
	all_seasons: number;
}
