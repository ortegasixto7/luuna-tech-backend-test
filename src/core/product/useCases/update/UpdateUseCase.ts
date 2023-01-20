import { IUseCaseCommand } from '../../../IUseCase';
import { UpdateRequest } from './UpdateRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { UpdateRequestValidation } from './UpdateRequestValidation';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { IEmailService } from '../../../../external/email/IEmailService';

export class UpdateUseCase implements IUseCaseCommand<UpdateRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence, private emailService: IEmailService) {}

  async execute(request: UpdateRequest): Promise<void> {
    new UpdateRequestValidation().validate(request);
    const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
    const product = await this.productPersistence.getByIdOrException(request.id);
    if (request.sku !== product.sku) {
      product.sku = request.sku;
      const productSku = await this.productPersistence.getBySkuOrNull(request.sku);
      if (productSku) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_SKU);
    }
    product.brand = request.brand;
    product.name = request.name;
    product.price = request.price;

    await this.productPersistence.update(product);
    let admins = await this.adminPersistence.getAll();
    admins = admins.filter((item) => item.id !== adminLoggedIn.id);
    const promises: Promise<void>[] = [];
    admins.map((item) => {
      promises.push(this.emailService.send(item.email, `Luuna Backend Test Notification`, `${adminLoggedIn.name} has updated a product`));
    });
    await Promise.allSettled(promises);
  }
}
