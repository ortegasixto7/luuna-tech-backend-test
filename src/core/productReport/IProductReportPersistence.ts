import { ProductReport } from './ProductReport';

export interface IProductReportPersistence {
  create(data: ProductReport): Promise<void>;
}
