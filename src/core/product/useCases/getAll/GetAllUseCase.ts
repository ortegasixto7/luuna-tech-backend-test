import { IUseCaseQuery } from '../../../IUseCase';
import { IProductPersistence } from '../../IProductPersistence';

export class GetAllUseCase implements IUseCaseQuery<any> {
  constructor(private productPersistence: IProductPersistence) {}

  async execute(): Promise<any> {
    return await this.productPersistence.getAll();
  }
}
