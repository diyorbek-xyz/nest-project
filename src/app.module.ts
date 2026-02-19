import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV || 'development'}` }),
		ServeStaticModule.forRoot({
			rootPath: path.join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads',
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const dbType = config.get<'sqlite' | 'mariadb'>('DB_TYPE');
				const entities = [];
				if (dbType === 'sqlite') {
					return {
						type: 'sqlite',
						database: config.get<string>('SQLITE_DB'),
						entities: entities,
						autoLoadEntities: true,
						synchronize: true,
					};
				}
				return {
					type: 'mariadb',
					host: config.get<string>('DB_HOST'),
					port: config.get<number>('DB_PORT'),
					username: config.get<string>('DB_USERNAME'),
					password: config.get<string>('DB_PASSWORD'),
					database: config.get<string>('DB_NAME'),
					entities: entities,
					synchronize: true,
					autoLoadEntities: true,
				};
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {
		console.log(process.env.DB_TYPE);
	}
}
