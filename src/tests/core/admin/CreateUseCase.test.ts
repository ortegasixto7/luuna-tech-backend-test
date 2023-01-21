import { CreateUseCase } from '../../../core/admin/useCases/create/CreateUseCase';
import { InMemoryDbAdminPersistence } from '../../../persistence/inMemoryDb/InMemoryDbAdminPersistence';
import { AuthServiceTest } from '../../../external/auth/AuthServiceTest';
import { EmailServiceTest } from '../../../external/email/EmailServiceTest';
import { Admin } from '../../../core/admin/Admin';
import { randomUUID } from 'crypto';
import { ExceptionCodeEnum } from '../../../external/exception/ExceptionCodeEnum';
import { Auth } from '../../../external/auth/Auth';

describe('Create Admin Use Case', () => {
  const adminPersistence = new InMemoryDbAdminPersistence();
  const authService = new AuthServiceTest();
  const emailService = new EmailServiceTest();

  const adminUser = new Admin();
  adminUser.id = randomUUID();
  adminUser.email = 'root@test.com';
  adminUser.name = 'Root';
  const authUser = new Auth();
  authUser.id = adminUser.id;
  authUser.email = adminUser.email;
  authUser.password = 'Password';
  const createUseCase = new CreateUseCase(adminPersistence, authService, emailService);

  beforeAll(async () => {
    await adminPersistence.create(adminUser);
    await authService.create(authUser);
  });

  test('Validate Input Data', async () => {
    try {
      await createUseCase.execute({ email: '', name: '', password: '', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.NAME_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ email: '', name: 'Name', password: '', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.EMAIL_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ email: 'Email', name: 'Name', password: '', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.PASSWORD_IS_REQUIRED);
    }
  });

  test('Validate email duplication', async () => {
    try {
      await createUseCase.execute({ email: adminUser.email, name: 'Name', password: '123456', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.UNAVAILABLE_EMAIL);
    }
  });
});
