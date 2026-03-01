import { IsOptional, IsString } from 'class-validator';

export class GetUserDto {
	@IsString()
    @IsOptional()
	username?: string;

	@IsString()
    @IsOptional()
	email?: string;

	@IsString()
    @IsOptional()
	id?: string;
}
