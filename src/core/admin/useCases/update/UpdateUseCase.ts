import { IUseCaseCommand } from '../../../IUseCase';
import { UpdateRequest } from './UpdateRequest';
import { IAdminPersistence } from '../../IAdminPersistence';
import { IAuthService } from '../../../../external/auth/IAuthService';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';

export class UpdateUseCase implements IUseCaseCommand<UpdateRequest> {
  constructor(private adminPersistence: IAdminPersistence, private authService: IAuthService) {}

  async execute(request: UpdateRequest): Promise<void> {
    const admin = await this.adminPersistence.getByIdOrException(request.id);
    if (request.name) admin.name = request.name;
    if (request.email) {
      const auth = await this.authService.getByIdOrException(request.id);
      const newAuthEmail = await this.authService.getByEmailOrNull(request.email);
      if (newAuthEmail) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_EMAIL);
      auth.email = request.email.toLowerCase();
      await this.authService.update(auth);
    }
    await this.adminPersistence.update(admin);
  }
}
