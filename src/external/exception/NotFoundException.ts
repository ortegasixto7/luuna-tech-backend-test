import { ExceptionCodeEnum } from './ExceptionCodeEnum';

export class NotFoundException extends Error {
  constructor(message: ExceptionCodeEnum) {
    super();
    this.message = message;
  }
}
