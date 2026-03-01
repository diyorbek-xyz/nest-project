import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from '../episode/entities/episode.entity';
import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';

@Module({
	controllers: [StudioController],
	providers: [StudioService],
})
export class StudioModule {}
