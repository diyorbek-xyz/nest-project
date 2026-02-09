import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';
import { PosterProcessor } from 'src/common/processors/poster.processor';
import { VideoProcessor } from 'src/common/processors/video.processor';
import { Repository } from 'typeorm';
import { EpisodeDto } from './dto/episode.dto';
import { EpisodeEntity } from './entities/episode.entity';

@Injectable()
export class EpisodeService {
	constructor(
		@InjectRepository(EpisodeEntity) private episodeRepository: Repository<EpisodeEntity>,
		private videoProcessor: VideoProcessor,
		private posterProcessor: PosterProcessor,
	) {}
	async getAll() {
		return this.episodeRepository.find({ relations: ['season'] });
	}
	async getById(id: number) {
		return this.episodeRepository.findOne({ relations: ['season'], where: { id } });
	}
	async create({ body, video, poster }: { body: EpisodeDto; video: string; poster: string }) {
		const folder = body.title.replaceAll(' ', '_').replaceAll(/\W/g, '');
		const outputDir = path.join('uploads', 'episodes', folder + '_' + Date.now());
		try {
			const videoHLS = await this.videoProcessor.processVideo(video, outputDir);
			const spriteVTT = await this.videoProcessor.processThumbnails(video, outputDir);
			const posterPath = await this.posterProcessor.processPoster(poster, outputDir, folder);
			const entity = this.episodeRepository.create({
				...body,
				previews: spriteVTT,
				video: videoHLS,
				poster: posterPath,
				folder: outputDir,
				season: { id: body.season },
			});

			const result = await this.episodeRepository.save(entity);
			fs.rmSync(video);
			fs.rmSync(poster);

			return result;
		} catch (error) {
			fs.rmSync(outputDir);
			fs.rmSync(video);
			fs.rmSync(poster);
			console.error(error);
			return error;
		}
	}
	async delete(id: number) {
		try {
			const entity = await this.episodeRepository.findOneBy({ id });

			if (entity?.poster) fs.unlinkSync(entity.poster);
			if (entity?.previews) fs.unlinkSync(entity.previews);
			if (entity?.video) fs.unlinkSync(entity.video);
			if (entity?.folder) fs.unlinkSync(entity.folder);

			return this.episodeRepository.delete({ id });
		} catch (error) {
			console.error(error);
			return error;
		}
	}
}
