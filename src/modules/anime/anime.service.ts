import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Anime } from './entities/anime.entity';

@Injectable()
export class AnimeService {
	constructor(@InjectRepository(Anime) private repository: Repository<Anime>) {}

	async create(createAnimeDto: CreateAnimeDto) {
		const result = await this.repository.save(createAnimeDto);
		return { message: 'success', action: 'create', result };
	}

	async findAll() {
		const animes = await this.repository.find();
		return animes;
	}

	async findOne(slug: string) {
		const anime = await this.repository.findOneBy({ slug });
		return anime;
	}

	async update(slug: string, updateAnimeDto: UpdateAnimeDto) {
		const result = await this.repository.update({ slug }, updateAnimeDto);
		return { message: 'success', action: 'update', result };
	}

	async remove(slug: string) {
		const result = await this.repository.delete({ slug });
		return { message: 'success', action: 'delete', result };
	}
}
