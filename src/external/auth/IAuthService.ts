import { Auth } from './Auth';

export interface IAuthService extends IAuthCreateService, IAuthGenerateTokenService, IAuthValidateTokenService {
  update(data: Auth): Promise<void>;
  getByEmailOrNull(email: string): Promise<Auth | null>;
}

export interface IAuthCreateService {
  create(data: Auth): Promise<void>;
}

export interface IAuthGenerateTokenService {
  generateToken(payload: any): string;
}

export interface IAuthValidateTokenService {
  validateTokenOrException(token: string | undefined): string;
}
