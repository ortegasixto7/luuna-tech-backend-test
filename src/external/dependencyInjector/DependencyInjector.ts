import { AuthService } from '../../external/auth/AuthService';
import { MongoDbAdminPersistence } from '../../persistence/mongoDb/MongoDbAdminPersistence';
import { MongoDbProductPersistence } from '../../persistence/mongoDb/MongoDbProductPersistence';
import { MongoDbProductReportPersistence } from '../../persistence/mongoDb/MongoDbProductReportPersistence';
import { IAuthService } from '../../external/auth/IAuthService';
import { IEmailService } from '../../external/email/IEmailService';
import { EmailService } from '../email/EmailService';
import { IAdminPersistence } from '../../core/admin/IAdminPersistence';
import { IProductPersistence } from '../../core/product/IProductPersistence';
import { IProductReportPersistence } from '../../core/productReport/IProductReportPersistence';
import { MongoDbClient } from '../../persistence/mongoDb/MongoDbClient';

export class DependencyInjector {
  // Persistences
  getAdminPersistence(): IAdminPersistence {
    return new MongoDbAdminPersistence(MongoDbClient.getInstance());
  }
  getProductPersistence(): IProductPersistence {
    return new MongoDbProductPersistence(MongoDbClient.getInstance());
  }
  getProductReportPersistence(): IProductReportPersistence {
    return new MongoDbProductReportPersistence(MongoDbClient.getInstance());
  }

  // Services
  getAuthService(): IAuthService {
    return new AuthService(MongoDbClient.getInstance());
  }
  getEmailService(): IEmailService {
    return new EmailService();
  }
}
