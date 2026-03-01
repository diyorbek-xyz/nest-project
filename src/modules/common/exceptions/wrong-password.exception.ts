import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongPasswordException extends HttpException {
	constructor(index: string) {
		const message = `Wrong password for user ${index}`;
		super(message, HttpStatus.BAD_REQUEST);
	}
}
