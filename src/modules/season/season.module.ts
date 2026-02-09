import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { SeasonEntity } from './entities/season.entity';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';

@Module({
	imports: [TypeOrmModule.forFeature([SeasonEntity]), CommonModule],
	controllers: [SeasonController],
	providers: [SeasonService],
})
export class SeasonModule {}
