import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
		const outFolder = path.join('uploads', 'episodes', folder + '_' + Date.now());
		const videoHLS = await this.videoProcessor.processVideo(video, outFolder);
		const spriteVTT = await this.videoProcessor.processThumbnails(video, outFolder);
		const posterPath = await this.posterProcessor.processPoster(poster, outFolder, folder);
		const entity = this.episodeRepository.create({
			...body,
			previews: spriteVTT,
			video: videoHLS,
			poster: posterPath,
			season: { id: body.season },
		});

		return this.episodeRepository.save(entity);
	}
	async delete(id: number) {
		return this.episodeRepository.delete({ id });
	}
}
