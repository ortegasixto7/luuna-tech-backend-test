import { IUseCaseQuery } from '../../../IUseCase';
import { IProductPersistence } from '../../IProductPersistence';
import { IProductReportPersistence } from '../../../productReport/IProductReportPersistence';
import { ProductReport } from '../../../productReport/ProductReport';

export class GetAllUseCase implements IUseCaseQuery<any> {
  constructor(private productPersistence: IProductPersistence, private productReportPersistence: IProductReportPersistence) {}

  async execute(ipAddress: string): Promise<any> {
    const report = new ProductReport();
    report.ipAddress = ipAddress;
    await this.productReportPersistence.create(report);
    return await this.productPersistence.getAll();
  }
}
