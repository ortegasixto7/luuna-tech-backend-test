import { IProductReportPersistence } from '../../core/productReport/IProductReportPersistence';
import { ProductReport } from '../../core/productReport/ProductReport';

export class InMemoryDbProductReportPersistence implements IProductReportPersistence {
  private collection: ProductReport[];
  constructor() {
    this.collection = [];
  }

  async create(data: ProductReport): Promise<void> {
    this.collection.push(data);
  }
}
