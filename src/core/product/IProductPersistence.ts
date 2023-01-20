import { Product } from './Product';

export interface IProductPersistence {
  create(data: Product): Promise<void>;
  update(data: Product): Promise<void>;
  delete(id: string): Promise<void>;
  getByIdOrException(id: string): Promise<Product>;
  getBySkuOrNull(sku: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
}
