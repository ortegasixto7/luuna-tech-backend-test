import { IAdminPersistence } from '../../core/admin/IAdminPersistence';
import { Collection, Db } from 'mongodb';
import { Admin } from '../../core/admin/Admin';
import { NotFoundException } from '../../external/exception/NotFoundException';
import { ExceptionCodeEnum } from '../../external/exception/ExceptionCodeEnum';

export class MongoDbAdminPersistence implements IAdminPersistence {
  private collection: Collection;
  constructor(database: Db) {
    this.collection = database.collection('admins');
  }

  async getByIdOrException(id: string): Promise<Admin> {
    const result = await this.collection.findOne({ id });
    if (!result) throw new NotFoundException(ExceptionCodeEnum.USER_NOT_FOUND);
    return result as any as Admin;
  }

  async create(data: Admin): Promise<void> {
    await this.collection.insertOne(data);
  }

  async update(data: Admin): Promise<void> {
    await this.collection.updateOne({ id: data.id }, { $set: data });
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }

  async getByEmailOrNull(email: string): Promise<Admin | null> {
    const result = await this.collection.findOne({ email });
    if (!result) return null;
    return result as any as Admin;
  }

  async getAll(): Promise<Admin[]> {
    const result: Admin[] = [];
    const resultData = await this.collection.find().toArray();
    resultData.map((item) => {
      delete (item as any)._id;
      result.push(item as any as Admin);
    });
    return result;
  }
}
