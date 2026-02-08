import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AnimeDto } from './dto/anime.dto';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
	constructor(private readonly animeService: AnimeService) {}

	@Get()
	async getAnimes() {
		return this.animeService.getAll();
	}

	@Get(':id')
	async getOne(@Param('id') id: string) {
		return this.animeService.getByID(parseInt(id));
	}

	@Post()
	async create(@Body() body: AnimeDto) {
		return this.animeService.create(body);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.animeService.delete(parseInt(id));
	}
}
