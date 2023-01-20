import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { IEmailService } from '../../../../external/email/IEmailService';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence, private emailService: IEmailService) {}

  async execute(request: DeleteRequest): Promise<void> {
    await Promise.all([
      this.adminPersistence.getByIdOrException(request.userId),
      this.productPersistence.getByIdOrException(request.id),
      this.productPersistence.delete(request.id)
    ]);
    const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
    let admins = await this.adminPersistence.getAll();
    admins = admins.filter((item) => item.id !== adminLoggedIn.id);
    const promises: Promise<void>[] = [];
    admins.map((item) => {
      promises.push(this.emailService.send(item.email, `Luuna Backend Test Notification`, `${adminLoggedIn.name} has deleted a product`));
    });
    await Promise.allSettled(promises);
  }
}
