import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { processPoster } from 'src/config/process_poster';
import { Repository } from 'typeorm';
import { SeasonDto } from './dto/season.dto';
import { SeasonEntity } from './entities/season.entity';

@Injectable()
export class SeasonService {
	constructor(@InjectRepository(SeasonEntity) private seasonRepository: Repository<SeasonEntity>) {}
	async create(poster: Express.Multer.File, body: SeasonDto) {
		const newDir = path.join('uploads', 'seasons', body.title.replaceAll(' ', '_').replaceAll(/\W/g, '') + '_' + Date.now());
		const posterPath = await processPoster(poster.path, newDir);

		const entity = this.seasonRepository.create({
			anime: { id: body.anime },
			poster: posterPath,
			season: body.season,
			title: body.title,
		});

		return this.seasonRepository.save(entity);
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
