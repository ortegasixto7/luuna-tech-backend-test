import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { IEmailService } from '../../../../external/email/IEmailService';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService, private emailService: IEmailService) {}

  async execute(request: DeleteRequest): Promise<void> {
    const admin = await this.adminPersistence.getByIdOrException(request.id);
    const deletedAdminName = JSON.parse(JSON.stringify(admin.name));
    await Promise.all([
      this.authService.getByIdOrException(request.id),
      this.adminPersistence.delete(request.id),
      this.authService.delete(request.id)
    ]);
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
        `${adminLoggedIn.name} has deleted to Admin ${deletedAdminName}`
      );
    }
  }
}
