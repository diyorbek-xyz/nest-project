import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';
import { PosterProcessor } from 'src/common/processors/poster.processor';
import { Repository } from 'typeorm';
import { SeasonDto } from './dto/season.dto';
import { SeasonEntity } from './entities/season.entity';

@Injectable()
export class SeasonService {
	constructor(
		@InjectRepository(SeasonEntity) private seasonRepository: Repository<SeasonEntity>,
		private posterProcessor: PosterProcessor,
	) {}
	async create(poster: Express.Multer.File, body: SeasonDto) {
		const folder = body.title.replaceAll(' ', '_').replaceAll(/\W/g, '');
		const outputDir = path.join('uploads', 'seasons', folder + '_' + Date.now());
		try {
			const posterPath = await this.posterProcessor.processPoster(poster.path, outputDir, folder);

			const entity = this.seasonRepository.create({
				anime: { id: body.anime },
				poster: posterPath,
				season: body.season,
				title: body.title,
				folder: outputDir,
			});
			const result = await this.seasonRepository.save(entity);
	
			fs.rmSync(poster.path);
			return result;
		} catch (error) {
			fs.rmSync(outputDir, { force: true, recursive: true });
			fs.rmSync(poster.path);
			console.error(error);
			return error;
		}
	}
	async getAll() {
		return this.seasonRepository.find({ relations: ['anime', 'episodes'] });
	}
	async getById(id: number) {
		return this.seasonRepository.findOne({ relations: ['anime', 'episodes'], where: { id } });
	}
	async delete(id: number) {
		return this.seasonRepository.delete({ id });
	}
}
