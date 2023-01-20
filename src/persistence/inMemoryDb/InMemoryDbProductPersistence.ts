import { IProductPersistence } from '../../core/product/IProductPersistence';
import { Product } from '../../core/product/Product';
import { NotFoundException } from '../../external/exception/NotFoundException';
import { ExceptionCodeEnum } from '../../external/exception/ExceptionCodeEnum';

export class InMemoryDbProductPersistence implements IProductPersistence {
  private collection: Product[];
  constructor() {
    this.collection = [];
  }

  async create(data: Product): Promise<void> {
    this.collection.push(data);
  }

  async update(data: Product): Promise<void> {
    const resultIndex = this.collection.findIndex((item) => item.id === data.id);
    this.collection[resultIndex] = { ...data };
  }

  async delete(id: string): Promise<void> {
    this.collection = this.collection.filter((item) => item.id !== id);
  }

  async getByIdOrException(id: string): Promise<Product> {
    const result = this.collection.find((item) => item.id === id);
    if (!result) throw new NotFoundException(ExceptionCodeEnum.PRODUCT_NOT_FOUND);
    return result as any as Product;
  }

  async getBySkuOrNull(sku: string): Promise<Product | null> {
    const result = this.collection.find((item) => item.sku === sku);
    if (!result) return null;
    return result as any as Product;
  }

  async getAll(): Promise<Product[]> {
    return this.collection;
  }
}
