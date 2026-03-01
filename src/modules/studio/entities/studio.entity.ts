import slugify from 'slugify';
import { Season } from 'src/modules/season/entities/season.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'studio' })
export class Studio {
	@PrimaryColumn()
	slug: string;

	@Column()
	name: string;

	@Column()
	image: string;

	@Column()
	director: string;

	@Column()
	country: string;

	@Column()
	flag: string;

	@OneToMany(() => Season, (season) => season.studio)
	seasons: Season[];

	@BeforeInsert()
	@BeforeUpdate()
	generateSlug() {
		this.slug = slugify(this.name, { lower: true, trim: true });
	}
}
