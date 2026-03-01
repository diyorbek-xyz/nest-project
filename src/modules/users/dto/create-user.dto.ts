import { IsAlphanumeric, IsByteLength, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/modules/common/enum/user_role';

export class UserDto {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	@IsAlphanumeric()
	username: string;

	@IsOptional()
	@IsString()
	bio: string;

	@IsOptional()
	@IsString()
	avatar: string;

	@IsByteLength(8, 16)
	@IsNotEmpty()
	@IsString()
	password: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsEnum(UserRole)
	@IsOptional()
	role: UserRole;
}
