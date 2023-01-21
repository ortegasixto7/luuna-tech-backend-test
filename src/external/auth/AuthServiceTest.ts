import { ExceptionCodeEnum } from '../exception/ExceptionCodeEnum';
import { NotFoundException } from '../exception/NotFoundException';
import { Auth } from './Auth';
import { IAuthService } from './IAuthService';
export class AuthServiceTest implements IAuthService {
  private collection: Auth[];
  constructor() {
    this.collection = [];
  }

  async update(data: Auth): Promise<void> {
    const resultIndex = this.collection.findIndex((item) => item.id === data.id);
    this.collection[resultIndex] = { ...data };
  }

  async delete(id: string): Promise<void> {
    this.collection = this.collection.filter((item) => item.id !== id);
  }

  async getByEmailOrNull(email: string): Promise<Auth | null> {
    const result = this.collection.find((item) => item.email === email);
    if (!result) return null;
    return result as any as Auth;
  }

  async getByIdOrException(id: string): Promise<Auth> {
    const result = this.collection.find((item) => item.id === id);
    if (!result) throw new NotFoundException(ExceptionCodeEnum.USER_NOT_FOUND);
    return result as any as Auth;
  }

  async create(data: Auth): Promise<void> {
    this.collection.push(data);
  }

  generateToken(payload: any): string {
    return '';
  }

  validateTokenOrException(token: string | undefined): string {
    return '';
  }
}
