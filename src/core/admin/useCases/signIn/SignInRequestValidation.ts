import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { IRequestValidator } from '../../../IRequestValidator';
import { SignInRequest } from './SignInRequest';

export class SignInRequestValidation implements IRequestValidator<SignInRequest> {
  validate(request: SignInRequest): void {
    if (!request.email) throw new BadRequestException(ExceptionCodeEnum.EMAIL_IS_REQUIRED);
    if (!request.password) throw new BadRequestException(ExceptionCodeEnum.PASSWORD_IS_REQUIRED);
  }
}
