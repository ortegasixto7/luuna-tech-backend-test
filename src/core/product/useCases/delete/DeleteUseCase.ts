import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { IEmailService } from '../../../../external/email/IEmailService';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence, private emailService: IEmailService) {}

  async execute(request: DeleteRequest): Promise<void> {
    const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
    await Promise.all([this.productPersistence.getByIdOrException(request.id), this.productPersistence.delete(request.id)]);
    const admins = await this.adminPersistence.getAllByExcludedId(adminLoggedIn.id);
    const recipientEmails: string[] = [];
    admins.map((item) => {
      recipientEmails.push(item.email);
    });
    await this.emailService.sendToMany(recipientEmails, 'Luuna Backend Test Notification', `${adminLoggedIn.name} has deleted a product`);
  }
}
