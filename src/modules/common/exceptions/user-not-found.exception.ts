import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
	constructor(index: string) {
		const message = `User ${index} not found`;
		super(message, HttpStatus.NOT_FOUND);
	}
}
