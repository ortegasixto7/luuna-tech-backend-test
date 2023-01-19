import * as bcrypt from 'bcrypt';
import { IUseCaseQuery } from '../../../IUseCase';
import { SignInRequest } from './SignInRequest';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { SignInRequestValidation } from './SignInRequestValidation';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';

export class SignInUseCase implements IUseCaseQuery<SignInRequest> {
  constructor(private authService: IAuthService) {}

  async execute(request: SignInRequest): Promise<any> {
    new SignInRequestValidation().validate(request);
    const auth = await this.authService.getByEmailOrNull(request.email);
    if (!auth) throw new BadRequestException(ExceptionCodeEnum.INVALID_LOGIN);
    if (!(await bcrypt.compare(request.password, auth.password))) throw new BadRequestException(ExceptionCodeEnum.INVALID_LOGIN);
    const token = this.authService.generateToken({ userId: auth.id });
    return { token };
  }
}
