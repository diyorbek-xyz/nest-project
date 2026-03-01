import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception';
import { UserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	) {}

	async createUser(dto: UserDto) {
		try {
			const salt = await bcrypt.genSalt();
			const password = await bcrypt.hash(dto.password, salt);
			const data = await this.repository.save({ ...dto, password });
			return data;
		} catch (error) {
			throw new HttpException(error.detail, HttpStatus.CONFLICT);
		}
	}

	async getAllUsers() {
		const data = await this.repository.find({});
		return data;
	}

	async getOne(indexes: GetUserDto, exclude: (keyof User)[] = ['password', 'role', 'deleted']) {
		const select = User.getKeys(exclude);
		let conditions = Object.entries(indexes)
			.filter(([_, value]) => value != null)
			.map(([key, value]) => ({ [key]: value }));

		const data = await this.repository.findOne({ where: conditions, relations: ['tasks'], select: select });

		if (!data) throw new UserNotFoundException(indexes.email ?? indexes.username ?? indexes.id ?? '');
		return data;
	}
	async update(id: string, body: UpdateUserDto) {
		const affected = (await this.repository.update({ id }, body)).affected;
		return { affected, id };
	}
	async delete(id: string) {
		const affected = (await this.repository.softDelete({ id })).affected;
		return { affected, id };
	}
}
