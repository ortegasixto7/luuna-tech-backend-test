import { IProductPersistence } from '../../core/product/IProductPersistence';
import { Collection, Db } from 'mongodb';
import { Product } from '../../core/product/Product';
import { NotFoundException } from '../../external/exception/NotFoundException';
import { ExceptionCodeEnum } from '../../external/exception/ExceptionCodeEnum';

export class MongoDbProductPersistence implements IProductPersistence {
  private collection: Collection;
  constructor(database: Db) {
    this.collection = database.collection('products');
  }

  async create(data: Product): Promise<void> {
    await this.collection.insertOne(data);
  }

  async update(data: Product): Promise<void> {
    await this.collection.updateOne({ id: data.id }, { $set: data });
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }

  async getByIdOrException(id: string): Promise<Product> {
    const result = await this.collection.findOne({ id });
    if (!result) throw new NotFoundException(ExceptionCodeEnum.PRODUCT_NOT_FOUND);
    return result as any as Product;
  }

  async getBySkuOrNull(sku: string): Promise<Product | null> {
    const result = await this.collection.findOne({ sku });
    if (!result) return null;
    return result as any as Product;
  }

  async getAll(): Promise<Product[]> {
    const result: Product[] = [];
    const resultData = await this.collection.find().toArray();
    resultData.map((item) => {
      result.push(item as any as Product);
    });
    return result;
  }
}
