import { IUseCaseQuery } from '../../../IUseCase';
import { IProductPersistence } from '../../IProductPersistence';
import { GetRequest } from '../../useCases/get/GetRequest';
import { IProductReportPersistence } from '../../../productReport/IProductReportPersistence';
import { ProductReport, ProductReportTypeEnum } from '../../../productReport/ProductReport';

export class GetUseCase implements IUseCaseQuery<any> {
  constructor(private productPersistence: IProductPersistence, private productReportPersistence: IProductReportPersistence) {}

  async execute(request: GetRequest): Promise<any> {
    const report = new ProductReport();
    report.ipAddress = request.ipAddress;
    report.type = ProductReportTypeEnum.SINGLE;
    await this.productReportPersistence.create(report);
    return await this.productPersistence.getByIdOrException(request.id);
  }
}
