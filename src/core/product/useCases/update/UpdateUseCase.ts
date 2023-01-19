import { IUseCaseCommand } from '../../../IUseCase';
import { UpdateRequest } from './UpdateRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { UpdateRequestValidation } from './UpdateRequestValidation';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';

export class UpdateUseCase implements IUseCaseCommand<UpdateRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence) {}

  async execute(request: UpdateRequest): Promise<void> {
    new UpdateRequestValidation().validate(request);
    await this.adminPersistence.getByIdOrException(request.userId);
    const product = await this.productPersistence.getByIdOrException(request.id);
    const productSku = await this.productPersistence.getBySkuOrNull(request.sku);
    if (productSku) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_SKU);
    if (request.brand) product.brand = request.brand;
    if (request.name) product.name = request.name;
    if (request.price) product.price = request.price;
    if (request.sku) product.sku = request.sku;
    await this.productPersistence.update(product);
  }
}
