import { IUseCaseCommand } from '../../../IUseCase';
import { SignUpRequest } from './SignUpRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { Admin } from '../../Admin';
import { SignUpRequestValidation } from './SignUpRequestValidation';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Auth } from '../../../../external/auth/Auth';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';

export class SignUpUseCase implements IUseCaseCommand<SignUpRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService) {}

  async execute(request: SignUpRequest): Promise<void> {
    new SignUpRequestValidation().validate(request);
    let auth = await this.authService.getByEmailOrNull(request.email);
    if (auth) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_EMAIL);
    auth = new Auth();
    auth.id = randomUUID();
    auth.password = await bcrypt.hash(request.password, 10);
    auth.email = request.email.toLowerCase();

    const admin = new Admin();
    admin.id = auth.id;
    admin.name = request.name;
    admin.email = auth.email;

    await Promise.all([this.authService.create(auth), this.adminPersistence.create(admin)]);
  }
}
