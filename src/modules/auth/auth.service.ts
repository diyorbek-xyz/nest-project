import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WrongPasswordException } from '../common/exceptions/wrong-password.exception';
import { UserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(data: UserDto) {
		const user = await this.usersService.createUser(data);
		return await this.createToken(user);
	}
	async login(data: LoginDto) {
		const user = await this.usersService.getOne(data, []);
		const isCorrectPass = await bcrypt.compare(data.password, user.password);
		if (!isCorrectPass) throw new WrongPasswordException(data.email ?? data.username ?? '');
		return await this.createToken(user);
	}
	async profile() {
		return;
	}
	private async createToken(user: User) {
		const payload = { id: user.id, username: user.username, role: user.role };
		const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '60d' });
		const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '120d' });
		return { payload, accessToken, refreshToken };
	}
}
