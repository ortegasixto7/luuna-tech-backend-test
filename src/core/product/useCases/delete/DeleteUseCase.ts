import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence) {}

  async execute(request: DeleteRequest): Promise<void> {
    await Promise.all([
      this.adminPersistence.getByIdOrException(request.userId),
      this.productPersistence.getByIdOrException(request.id),
      this.productPersistence.delete(request.id)
    ]);
  }
}
