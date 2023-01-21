import { randomUUID } from 'crypto';
import { IUseCaseCommand } from '../../../IUseCase';
import { CreateRequest } from './CreateRequest';
import { IAdminPersistence } from '../../../admin/IAdminPersistence';
import { IProductPersistence } from '../../IProductPersistence';
import { CreateRequestValidation } from './CreateRequestValidation';
import { BadRequestException } from '../../../../external/exception/BadRequestException';
import { ExceptionCodeEnum } from '../../../../external/exception/ExceptionCodeEnum';
import { Product } from '../../Product';
import { IEmailService } from '../../../../external/email/IEmailService';

export class CreateUseCase implements IUseCaseCommand<CreateRequest> {
  constructor(private productPersistence: IProductPersistence, private adminPersistence: IAdminPersistence, private emailService: IEmailService) {}

  async execute(request: CreateRequest): Promise<void> {
    new CreateRequestValidation().validate(request);
    const adminLoggedIn = await this.adminPersistence.getByIdOrException(request.userId);
    let product = await this.productPersistence.getBySkuOrNull(request.sku);
    if (product) throw new BadRequestException(ExceptionCodeEnum.UNAVAILABLE_SKU);
    product = new Product();
    product.id = randomUUID();
    product.brand = request.brand;
    product.name = request.name;
    product.price = request.price;
    product.sku = request.sku;
    await this.productPersistence.create(product);

    const admins = await this.adminPersistence.getAllByExcludedId(adminLoggedIn.id);
    const recipientEmails: string[] = [];
    admins.map((item) => {
      recipientEmails.push(item.email);
    });
    await this.emailService.sendToMany(recipientEmails, 'Luuna Backend Test Notification', `${adminLoggedIn.name} has created a product`);
  }
}
