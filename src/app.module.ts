import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Anime } from './modules/anime/entities/anime.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Episode } from './modules/episode/entities/episode.entity';
import { EpisodeModule } from './modules/episode/episode.module';
import { History } from './modules/history/entities/history.entity';
import { HistoryModule } from './modules/history/history.module';
import { Season } from './modules/season/entities/season.entity';
import { SeasonModule } from './modules/season/season.module';
import { Studio } from './modules/studio/entities/studio.entity';
import { StudioModule } from './modules/studio/studio.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: '',
			database: 'project',
			schema: 'anibla',
			synchronize: true,
			autoLoadEntities: true,
			entities: [Episode, Anime, Season, User, Studio, History],
		}),
		UsersModule,
		AuthModule,
		EpisodeModule,
		SeasonModule,
		StudioModule,
		HistoryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {
		console.log(process.env.DB_TYPE);
	}
}
