import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimeEntity } from './entities/anime.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AnimeEntity])],
	controllers: [AnimeController],
	providers: [AnimeService],
})
export class AnimeModule {}
