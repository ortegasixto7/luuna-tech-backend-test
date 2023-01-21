import * as bcrypt from 'bcrypt';
import { IUseCaseCommand } from '../../../IUseCase';
import { CreateRequest } from './CreateRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { Admin } from '../../Admin';
import { CreateRequestValidation } from './CreateRequestValidation';
import { randomUUID } from 'crypto';
import { Auth } from '../../../../external/auth/Auth';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { IEmailService } from '../../../../external/email/IEmailService';

export class CreateUseCase implements IUseCaseCommand<CreateRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService, private emailService: IEmailService) {}

  async execute(request: CreateRequest): Promise<void> {
    new CreateRequestValidation().validate(request);
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
    const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
    const admins = await this.adminPersistence.getAllByExcludedId(adminLoggedIn.id);
    const recipientEmails: string[] = [];
    admins.map((item) => {
      recipientEmails.push(item.email);
    });
    await this.emailService.sendToMany(
      recipientEmails,
      'Luuna Backend Test Notification',
      `${adminLoggedIn.name} has created to Admin ${admin.name}`
    );
  }
}
