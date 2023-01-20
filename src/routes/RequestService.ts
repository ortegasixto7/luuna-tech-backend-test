import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '../external/exception/BadRequestException';
import { NotFoundException } from '../external/exception/NotFoundException';
import { Response } from 'express';
import { ExceptionCodeEnum } from '../external/exception/ExceptionCodeEnum';

export class RequestService {
  async verifyToken(token: string | undefined): Promise<string> {
    if (!token) throw new BadRequestException(ExceptionCodeEnum.INVALID_AUTH_TOKEN);
    try {
      const tokenResult = jwt.verify(token?.replace('Bearer ', ''), process.env.JWT_SECRET!);
      console.log('USER_ID', (tokenResult as any).userId);
      return (tokenResult as any).userId;
    } catch (error) {
      throw new BadRequestException(ExceptionCodeEnum.INVALID_AUTH_TOKEN);
    }
  }

  static async wrapper(callbackFunction: Function, res: Response): Promise<any> {
    try {
      const response = await callbackFunction();
      res.status(200).json(response ? response : undefined);
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.warn(`BAD_REQUEST ${error.message}`);
        res.status(400).json({ error: error.message });
      } else if (error instanceof NotFoundException) {
        console.warn(`NOT_FOUND ${error.message}`);
        res.status(404).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'INTERNAL_ERROR' });
      }
    }
  }
}
