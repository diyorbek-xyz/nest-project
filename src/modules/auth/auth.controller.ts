import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('auth/register')
	async register(@Body() data: UserDto) {
		return await this.authService.register(data);
	}

	@HttpCode(200)
	@Post('auth/login')
	async login(@Body() data: LoginDto) {
		return await this.authService.login(data);
	}

	@UseGuards(AuthGuard)
	@Get('/profile')
	async profile(@Request() req: Request) {
		return this.usersService.getOne({ username: req['user']['username'] });
	}
}
