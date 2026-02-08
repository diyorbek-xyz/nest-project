import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage';
import { SeasonDto } from './dto/season.dto';
import { SeasonService } from './season.service';

@Controller('season')
export class SeasonController {
	constructor(private readonly seasonService: SeasonService) {}

	@Post()
	@UseInterceptors(FileInterceptor('poster', { storage }))
	async create(@UploadedFile() poster: Express.Multer.File, @Body() body: SeasonDto) {
		return this.seasonService.create(poster, body);
	}

	@Get()
	async getAll() {
		return this.seasonService.getAll();
	}

	@Get(':id')
	async getById(@Param('id') id: number) {
		return this.seasonService.getById(id);
	}
	@Delete(':id')
	async delete(@Param('id') id: number) {
		return this.seasonService.delete(id);
	}
}
