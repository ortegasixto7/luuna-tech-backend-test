import { IUseCaseCommand } from '../../../IUseCase';
import { UpdateRequest } from './UpdateRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { IEmailService } from '../../../../external/email/IEmailService';

export class UpdateUseCase implements IUseCaseCommand<UpdateRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService, private emailService: IEmailService) {}

  async execute(request: UpdateRequest): Promise<void> {
    const admin = await this.adminPersistence.getByIdOrException(request.id);
    const updatedAdminName = JSON.parse(JSON.stringify(admin.name));
    if (request.name) admin.name = request.name;
    if (request.email) {
      const auth = await this.authService.getByIdOrException(request.id);
      const newAuthEmail = await this.authService.getByEmailOrNull(request.email);
      if (newAuthEmail) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_EMAIL);
      auth.email = request.email.toLowerCase();
      await this.authService.update(auth);
      admin.email = auth.email;
    }
    if (request.name || request.email) {
      await this.adminPersistence.update(admin);
      if (admin.id !== request.userId) {
        const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
        const admins = await this.adminPersistence.getAllByExcludedId(adminLoggedIn.id);
        const recipientEmails: string[] = [];
        admins.map((item) => {
          recipientEmails.push(item.email);
        });
        await this.emailService.sendToMany(
          recipientEmails,
          'Luuna Backend Test Notification',
          `${adminLoggedIn.name} has updated to Admin ${updatedAdminName}`
        );
      }
    }
  }
}
