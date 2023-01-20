import { IUseCaseQuery } from '../../../IUseCase';
import { IAdminPersistence } from '../../IAdminPersistence';

export class GetAllUseCase implements IUseCaseQuery<any> {
  constructor(private adminPersistence: IAdminPersistence) {}

  async execute(): Promise<any> {
    return await this.adminPersistence.getAll();
  }
}
