import { IAdminPersistence } from '../../core/admin/IAdminPersistence';
import { Admin } from '../../core/admin/Admin';
import { NotFoundException } from '../../external/exception/NotFoundException';
import { ExceptionCodeEnum } from '../../external/exception/ExceptionCodeEnum';

export class InMemoryDbAdminPersistence implements IAdminPersistence {
  private collection: Admin[];
  constructor() {
    this.collection = [];
  }

  async getByIdOrException(id: string): Promise<Admin> {
    const result = this.collection.find((item) => item.id === id);
    if (!result) throw new NotFoundException(ExceptionCodeEnum.USER_NOT_FOUND);
    return result as any as Admin;
  }

  async create(data: Admin): Promise<void> {
    this.collection.push(data);
  }

  async update(data: Admin): Promise<void> {
    const resultIndex = this.collection.findIndex((item) => item.id === data.id);
    this.collection[resultIndex] = { ...data };
  }

  async delete(id: string): Promise<void> {
    this.collection = this.collection.filter((item) => item.id !== id);
  }

  async getByEmailOrNull(email: string): Promise<Admin | null> {
    const result = this.collection.find((item) => item.email === email);
    if (!result) return null;
    return result as any as Admin;
  }

  async getAll(): Promise<Admin[]> {
    return this.collection;
  }
}
