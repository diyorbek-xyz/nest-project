import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimeDto } from './dto/anime.dto';
import { AnimeEntity } from './entities/anime.entity';

@Injectable()
export class AnimeService {
	constructor(@InjectRepository(AnimeEntity) private animeRepository: Repository<AnimeEntity>) {}
	data: AnimeDto[];

	async getAll(): Promise<AnimeEntity[]> {
		return this.animeRepository.find({ relations: ['seasons'] });
	}
	async getByID(id: number) {
		return this.animeRepository.findOne({ relations: ['seasons'], where: { id } });
	}
	async create(body: AnimeDto) {
		const entity = new AnimeEntity();
		entity.title = body.title;
		entity.director = body.director;
		entity.type = body.type;
		return this.animeRepository.save(entity);
	}
	async delete(id: number) {
		return this.animeRepository.delete({ id });
	}
}
