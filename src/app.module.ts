import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './modules/anime/anime.module';
import { AnimeEntity } from './modules/anime/entities/anime.entity';
import { EpisodeEntity } from './modules/episode/entities/episode.entity';
import { EpisodeModule } from './modules/episode/episode.module';
import { SeasonEntity } from './modules/season/entities/season.entity';
import { SeasonModule } from './modules/season/season.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path.join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads',
		}),
		TypeOrmModule.forRoot({
			type: 'mariadb',
			host: 'localhost',
			port: 3306,
			username: 'user',
			password: '5588',
			database: 'animes',
			entities: [AnimeEntity, EpisodeEntity, SeasonEntity],
			synchronize: true,
			autoLoadEntities: true,
		}),
		AnimeModule,
		EpisodeModule,
		SeasonModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
