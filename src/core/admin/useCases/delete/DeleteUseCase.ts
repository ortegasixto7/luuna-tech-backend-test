import { IUseCaseCommand } from '../../../IUseCase';
import { DeleteRequest } from './DeleteRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';

export class DeleteUseCase implements IUseCaseCommand<DeleteRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService) {}

  async execute(request: DeleteRequest): Promise<void> {
    await Promise.all([
      this.adminPersistence.getByIdOrException(request.id),
      this.authService.getByIdOrException(request.id),
      this.adminPersistence.delete(request.id),
      this.authService.delete(request.id)
    ]);
  }
}
