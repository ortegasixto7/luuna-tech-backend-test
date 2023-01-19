import { randomUUID } from 'crypto';
import { IUseCaseCommand } from '../../../IUseCase';
import { CreateRequest } from './CreateRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { CreateRequestValidation } from './CreateRequestValidation';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { Product } from '../../Product';

export class CreateUseCase implements IUseCaseCommand<CreateRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence) {}

  async execute(request: CreateRequest): Promise<void> {
    new CreateRequestValidation().validate(request);
    await this.adminPersistence.getByIdOrException(request.userId);
    let product = await this.productPersistence.getBySkuOrNull(request.sku);
    if (product) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_SKU);
    product = new Product();
    product.id = randomUUID();
    product.brand = request.brand;
    product.name = request.name;
    product.price = request.price;
    product.sku = request.sku;
    await this.productPersistence.create(product);
  }
}
