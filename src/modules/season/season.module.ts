import { Module } from '@nestjs/common';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonEntity } from './entities/season.entity';

@Module({
	imports: [TypeOrmModule.forFeature([SeasonEntity])],
	controllers: [SeasonController],
	providers: [SeasonService],
})
export class SeasonModule {}
