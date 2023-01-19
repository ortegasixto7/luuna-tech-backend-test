import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { IRequestValidator } from '../../../IRequestValidator';
import { CreateRequest } from './CreateRequest';

export class CreateRequestValidation implements IRequestValidator<CreateRequest> {
  validate(request: CreateRequest): void {
    if (!request.name) throw new BadRequestException(ExceptionCodeEnum.NAME_IS_REQUIRED);
    if (!request.email) throw new BadRequestException(ExceptionCodeEnum.EMAIL_IS_REQUIRED);
    if (!request.password) throw new BadRequestException(ExceptionCodeEnum.PASSWORD_IS_REQUIRED);
  }
}
