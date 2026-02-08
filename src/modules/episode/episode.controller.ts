import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage';
import { EpisodeDto } from './dto/episode.dto';
import { EpisodeService } from './episode.service';

@Controller('episode')
export class EpisodeController {
	constructor(private readonly episodeService: EpisodeService) {}

	@Get()
	async getAll() {
		return this.episodeService.getAll();
	}

	@Get(':id')
	async getById(@Param('id') id: number) {
		return this.episodeService.getById(id);
	}

	@Post()
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'video', maxCount: 1 },
				{ name: 'poster', maxCount: 1 },
			],
			{ storage },
		),
	)
	async create(@UploadedFiles() files: { video?: Express.Multer.File[]; poster?: Express.Multer.File[] }, @Body() body: EpisodeDto) {
		if (!files.video || !files.poster) {
			return;
		}
		return this.episodeService.create({ poster: files.poster[0].path, video: files.video[0].path, body });
	}
	@Delete(':id')
	async delete(@Param('id') id: number) {
		return this.episodeService.delete(id);
	}
}
