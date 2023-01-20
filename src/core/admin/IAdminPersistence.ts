import { Admin } from './Admin';

export interface IAdminPersistence {
  create(data: Admin): Promise<void>;
  update(data: Admin): Promise<void>;
  delete(id: string): Promise<void>;
  getByEmailOrNull(email: string): Promise<null | Admin>;
  getByIdOrException(id: string): Promise<Admin>;
  getAll(): Promise<Admin[]>;
}
