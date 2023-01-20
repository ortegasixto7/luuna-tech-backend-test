import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { IEmailService } from '../../../../external/email/IEmailService';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService, private emailService: IEmailService) {}

  async execute(request: DeleteRequest): Promise<void> {
    const admin = await this.adminPersistence.getByIdOrException(request.id);
    const updatedAdminName = JSON.parse(JSON.stringify(admin.name));
    await Promise.all([
      this.authService.getByIdOrException(request.id),
      this.adminPersistence.delete(request.id),
      this.authService.delete(request.id)
    ]);
    if (admin.id !== request.userId) {
      const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
      let admins = await this.adminPersistence.getAll();
      admins = admins.filter((item) => item.id !== adminLoggedIn.id);
      const promises: Promise<void>[] = [];
      admins.map((item) => {
        promises.push(
          this.emailService.send(item.email, `Luuna Backend Test Notification`, `${adminLoggedIn.name} has deleted to Admin ${updatedAdminName}`)
        );
      });
      await Promise.allSettled(promises);
    }
  }
}
