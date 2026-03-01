import { IsAlphanumeric, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/modules/common/enum/user_role';

export class UpdateUserDto {
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

	@IsString()
	bio: string;

	@IsString()
	avatar: string;

	@IsOptional()
	@IsEnum(UserRole)
	role: UserRole;
}
