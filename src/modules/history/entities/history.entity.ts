import { Anime } from 'src/modules/anime/entities/anime.entity';
import { Episode } from 'src/modules/episode/entities/episode.entity';
import { Season } from 'src/modules/season/entities/season.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class History {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.history, { onDelete: 'CASCADE' })
	user: User;

	@OneToOne(() => Anime)
	@JoinColumn()
	anime: Anime;

	@OneToOne(() => Season)
	@JoinColumn()
	season: Season;

	@OneToOne(() => Episode)
	@JoinColumn()
	episode: Episode;

	@Column()
	time: number;

	@CreateDateColumn({ type: 'timestamptz' })
	created: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated: Date;
}
