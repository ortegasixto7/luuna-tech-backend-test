import { randomUUID } from 'crypto';
import { UpdateUseCase } from '../../../core/admin/useCases/update/UpdateUseCase';
import { InMemoryDbAdminPersistence } from '../../../persistence/inMemoryDb/InMemoryDbAdminPersistence';
import { AuthServiceTest } from '../../../external/auth/AuthServiceTest';
import { EmailServiceTest } from '../../../external/email/EmailServiceTest';
import { Admin } from '../../../core/admin/Admin';
import { ExceptionCodeEnum } from '../../../external/exception/ExceptionCodeEnum';
import { Auth } from '../../../external/auth/Auth';

describe('Update Admin Use Case', () => {
  const adminPersistence = new InMemoryDbAdminPersistence();
  const authService = new AuthServiceTest();
  const emailService = new EmailServiceTest();

  const rootUser = new Admin();
  rootUser.id = randomUUID();
  rootUser.email = 'root@test.com';
  rootUser.name = 'Root';
  const rootAuthUser = new Auth();
  rootAuthUser.id = rootUser.id;
  rootAuthUser.email = rootUser.email;
  rootAuthUser.password = 'Password';

  const adminUser = new Admin();
  adminUser.id = randomUUID();
  adminUser.email = 'user@test.com';
  adminUser.name = 'User';
  const adminAuthUser = new Auth();
  adminAuthUser.id = adminUser.id;
  adminAuthUser.email = adminUser.email;
  adminAuthUser.password = 'Password';
  const updateUseCase = new UpdateUseCase(adminPersistence, authService, emailService);

  beforeAll(async () => {
    await Promise.all([
      adminPersistence.create(adminUser),
      adminPersistence.create(rootUser),
      authService.create(rootAuthUser),
      authService.create(adminAuthUser)
    ]);
  });

  test('Validate Input Data', async () => {
    try {
      await updateUseCase.execute({ id: '', email: '', name: '', userId: rootUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.USER_NOT_FOUND);
    }
    try {
      await updateUseCase.execute({ id: adminUser.id, email: '', name: '', userId: rootUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.NAME_IS_REQUIRED);
    }
    try {
      await updateUseCase.execute({ id: adminUser.id, email: '', name: 'Name', userId: rootUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.EMAIL_IS_REQUIRED);
    }
    try {
      await updateUseCase.execute({ id: adminUser.id, email: 'Email', name: 'Name', userId: rootUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.PASSWORD_IS_REQUIRED);
    }
  });

  test('Validate email duplication', async () => {
    try {
      await updateUseCase.execute({ id: adminUser.id, email: rootUser.email, name: 'Name', userId: rootUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.UNAVAILABLE_EMAIL);
    }
  });
});
