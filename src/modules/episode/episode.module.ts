import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { EpisodeEntity } from './entities/episode.entity';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';

@Module({
	imports: [TypeOrmModule.forFeature([EpisodeEntity]), CommonModule],
	controllers: [EpisodeController],
	providers: [EpisodeService],
})
export class EpisodeModule {}
