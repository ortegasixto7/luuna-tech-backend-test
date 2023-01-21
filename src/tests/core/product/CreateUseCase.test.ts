import { randomUUID } from 'crypto';
import { CreateUseCase } from '../../../core/product/useCases/create/CreateUseCase';
import { InMemoryDbAdminPersistence } from '../../../persistence/inMemoryDb/InMemoryDbAdminPersistence';
import { InMemoryDbProductPersistence } from '../../../persistence/inMemoryDb/InMemoryDbProductPersistence';
import { AuthServiceTest } from '../../../external/auth/AuthServiceTest';
import { EmailServiceTest } from '../../../external/email/EmailServiceTest';
import { Admin } from '../../../core/admin/Admin';
import { ExceptionCodeEnum } from '../../../external/exception/ExceptionCodeEnum';
import { Auth } from '../../../external/auth/Auth';
import { Product } from '../../../core/product/Product';

describe('Create Product Use Case', () => {
  const adminPersistence = new InMemoryDbAdminPersistence();
  const productPersistence = new InMemoryDbProductPersistence();
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

  const product = new Product();
  product.brand = 'Brand';
  product.name = 'Name';
  product.price = 100;
  product.sku = 'COD123';

  const createUseCase = new CreateUseCase(productPersistence, adminPersistence, emailService);

  beforeAll(async () => {
    await Promise.all([adminPersistence.create(adminUser), authService.create(authUser), productPersistence.create(product)]);
  });

  test('Validate Input Data', async () => {
    try {
      await createUseCase.execute({ brand: '', name: '', price: 0, sku: '', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.SKU_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ brand: '', name: '', price: 0, sku: 'COD123', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.NAME_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ brand: '', name: 'Name', price: 0, sku: 'COD123', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.PRICE_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ brand: '', name: 'Name', price: -1, sku: 'COD123', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.PRICE_IS_REQUIRED);
    }
    try {
      await createUseCase.execute({ brand: '', name: 'Name', price: 1, sku: 'COD123', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.BRAND_IS_REQUIRED);
    }
  });

  test('Validate sku duplication', async () => {
    try {
      await createUseCase.execute({ brand: 'Brand', name: 'Name', price: 1, sku: 'COD123', userId: adminUser.id });
    } catch (error) {
      expect((error as any).message).toEqual(ExceptionCodeEnum.UNAVAILABLE_SKU);
    }
  });
});
