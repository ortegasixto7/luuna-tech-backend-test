import { AuthService } from '../../external/auth/AuthService';
import { MongoDbAdminPersistence } from '../../persistence/mongoDb/MongoDbAdminPersistence';
import { IAuthService } from '../../external/auth/IAuthService';
import { IAdminPersistence } from '../../core/admin/IAdminPersistence';
import { MongoDbClient } from '../../persistence/mongoDb/MongoDbClient';

export class DependencyInjector {
  // Persistences
  getAdminPersistence(): IAdminPersistence {
    return new MongoDbAdminPersistence(MongoDbClient.getInstance());
  }

  // Services
  getAuthService(): IAuthService {
    return new AuthService(MongoDbClient.getInstance());
  }
}
