import { Module } from '@nestjs/common';
import { PosterProcessor } from './processors/poster.processor';
import { VideoProcessor } from './processors/video.processor';

@Module({
	providers: [VideoProcessor, PosterProcessor],
	exports: [VideoProcessor, PosterProcessor],
})
export class CommonModule {}
