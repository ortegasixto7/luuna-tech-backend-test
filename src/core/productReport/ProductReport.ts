import { randomUUID } from 'crypto';

export class ProductReport {
  id: string = randomUUID();
  ipAddress: string = '';
  createdAt: number = Date.now();
  type: ProductReportTypeEnum = ProductReportTypeEnum.ALL;
}

export enum ProductReportTypeEnum {
  ALL = 0,
  SINGLE
}
