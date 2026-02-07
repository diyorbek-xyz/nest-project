import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnimeDto } from './dto/anime.dto';

@Controller('anime')
export class AnimeController {
	data: AnimeDto[];

	constructor() {
		this.data = [
			{
				id: 1,
				name: 'Naruto',
				director: 'Masashi Kishimoto',
				episodes: 700,
			},
			{
				id: 2,
				name: 'Boruto',
				director: 'Someone Anyones',
				episodes: 300,
			},
			{
				id: 3,
				name: 'Saruto',
				director: 'Anyone Somones',
				episodes: 100,
			},
		];
	}

	@Get()
	async getAnimes() {
		return this.data;
	}

	@Post()
	async create(@Body() body: AnimeDto) {
		return [...this.data, { id: new Date().getTime(), ...body }];
	}
}
