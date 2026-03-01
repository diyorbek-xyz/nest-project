import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/')
	async create(@Body() body: UserDto) {
		const result = await this.usersService.createUser(body);
		return result;
	}

	@Get('/')
	async get() {
		const data = await this.usersService.getAllUsers();
		return data;
	}

	@Post('/one')
	async getOne(@Body() indexes: GetUserDto) {
		if (!indexes.email && !indexes.username && !indexes.id) throw new BadRequestException();
		const result = await this.usersService.getOne(indexes);
		return result;
	}

	@Put('/:id')
	async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
		const result = await this.usersService.update(id, body);
		return result;
	}

	@Delete('/:id')
	async delete(@Param('id') id: string) {
		const result = await this.usersService.delete(id);
		return result;
	}
}
