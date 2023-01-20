import { AuthService } from '../../external/auth/AuthService';
import { MongoDbAdminPersistence } from '../../persistence/mongoDb/MongoDbAdminPersistence';
import { MongoDbProductPersistence } from '../../persistence/mongoDb/MongoDbProductPersistence';
import { IAuthService } from '../../external/auth/IAuthService';
import { IEmailService } from '../../external/email/IEmailService';
import { MailtrapEmailService } from '../../external/email/MailtrapEmailService';
import { IAdminPersistence } from '../../core/admin/IAdminPersistence';
import { IProductPersistence } from '../../core/product/IProductPersistence';
import { MongoDbClient } from '../../persistence/mongoDb/MongoDbClient';

export class DependencyInjector {
  // Persistences
  getAdminPersistence(): IAdminPersistence {
    return new MongoDbAdminPersistence(MongoDbClient.getInstance());
  }
  getProductPersistence(): IProductPersistence {
    return new MongoDbProductPersistence(MongoDbClient.getInstance());
  }

  // Services
  getAuthService(): IAuthService {
    return new AuthService(MongoDbClient.getInstance());
  }
  getEmailService(): IEmailService {
    return new MailtrapEmailService();
  }
}
