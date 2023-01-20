import { ExceptionCodeEnum } from './ExceptionCodeEnum';

export class BadRequestException extends Error {
  constructor(message: ExceptionCodeEnum) {
    super();
    this.message = message;
  }
}
