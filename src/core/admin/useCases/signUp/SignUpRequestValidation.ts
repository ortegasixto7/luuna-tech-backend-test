import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { IRequestValidator } from '../../../IRequestValidator';
import { SignUpRequest } from './SignUpRequest';

export class SignUpRequestValidation implements IRequestValidator<SignUpRequest> {
  validate(request: SignUpRequest): void {
    if (!request.email) throw new BadRequestException(ExceptionCodeEnum.EMAIL_IS_REQUIRED);
    if (!request.password) throw new BadRequestException(ExceptionCodeEnum.PASSWORD_IS_REQUIRED);
  }
}
