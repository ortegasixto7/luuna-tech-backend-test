import { Collection, Db } from 'mongodb';
import { IProductReportPersistence } from '../../core/productReport/IProductReportPersistence';
import { ProductReport } from '../../core/productReport/ProductReport';

export class MongoDbProductReportPersistence implements IProductReportPersistence {
  private collection: Collection;
  constructor(database: Db) {
    this.collection = database.collection('productReports');
  }

  async create(data: ProductReport): Promise<void> {
    await this.collection.insertOne(data);
  }
}
