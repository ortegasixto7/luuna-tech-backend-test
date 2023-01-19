import { Auth } from './Auth';
import { IAuthService } from './IAuthService';
import { Collection, Db } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '../../config/config';
import { BadRequestException } from '../exception/BadRequestException';
import { ExceptionCodeEnum } from '../exception/ExceptionCodeEnum';
import { NotFoundException } from '../exception/NotFoundException';

export class AuthService implements IAuthService {
  private collection: Collection;
  constructor(database: Db) {
    this.collection = database.collection('auth');
  }

  async getByIdOrException(id: string): Promise<Auth> {
    const result = await this.collection.findOne({ id });
    if (!result) throw new NotFoundException(ExceptionCodeEnum.USER_NOT_FOUND);
    return result as any as Auth;
  }

  async update(data: Auth): Promise<void> {
    await this.collection.updateOne({ id: data.id }, { $set: data });
  }

  async getByEmailOrNull(email: string): Promise<Auth | null> {
    const result = await this.collection.findOne({ email });
    if (!result) return null;
    return result as any as Auth;
  }

  async create(data: Auth): Promise<void> {
    await this.collection.insertOne(data);
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  validateTokenOrException(token: string | undefined): string {
    if (!token) throw new BadRequestException(ExceptionCodeEnum.INVALID_AUTH_TOKEN);
    try {
      const tokenResult = jwt.verify(token?.replace('Bearer ', ''), JWT_SECRET);
      console.log('USER_ID', (tokenResult as any).userId);
      return (tokenResult as any).userId;
    } catch (error) {
      throw new BadRequestException(ExceptionCodeEnum.INVALID_AUTH_TOKEN);
    }
  }
}
